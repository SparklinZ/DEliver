pragma experimental ABIEncoderV2;
pragma solidity ^0.5.0;
import "./ERC20.sol";

contract Order {
    struct customer {
        uint8 rating;
        string deliveryAddress;
        bool exist;
    }

    struct rider {
        uint8 rating;
        bool exist;
    }

    struct order {
        address customer;
        address rider;
        uint256 orderId;
        uint256 deliveryFee;
        string restaurant;
        // item name to quantity
        string[] itemNames;
        uint256[] itemQuantities;
        bool delivered;
        uint256 orderTime;
    }

    struct conflict {
        string customerComplaint;
        string riderComplaint;
        bool votingNeeded;
        uint256 customerVotes;
        uint256 riderVotes;
        // Time last complaint was filed, unix
        // datetime stamp
        uint256 updateTime;
        bool resolved;
        // check address if already voted
        mapping(address => bool) voted;
    }

    // Time and orderId to resolve next conflict
    uint256 nextResolveTime;
    uint256 nextResolveOrderId;
    // orderID => Conflict struct
    mapping(uint256 => conflict) public conflicts;
    mapping(address => customer) public customers;
    mapping(address => rider) public riders;
    // orderID => Order struct
    mapping(uint256 => order) public orders;
    // orderID => customer_token
    mapping(uint256 => uint256) private customerTokens;

    ERC20 erc20;
    uint256 orderIDCounter = 1;

    constructor(ERC20 erc20address) public {
        erc20 = erc20address;
    }

    modifier customerOnly() {
        require(customers[msg.sender].exist, "Customer only");
        _;
    }

    modifier registeredUserOnly() {
        require(
            customers[msg.sender].exist || riders[msg.sender].exist,
            "Registered User only"
        );
        _;
    }

    modifier ownOrderOnly(uint256 orderId) {
        require(
            orders[orderId].customer == msg.sender,
            "Can edit own orders only"
        );
        _;
    }

    modifier resolveConflict() {
        // + 86400
        if (now >= nextResolveTime) {
            if (
                conflicts[nextResolveOrderId].customerVotes >=
                conflicts[nextResolveOrderId].riderVotes
            ) {
                //transfer money to customer
            } else {
                //transfer money to rider
            }
            conflicts[nextResolveOrderId].resolved = true;
            conflicts[nextResolveOrderId].votingNeeded = false;
            //find the next conflict that requires resolution and update the nextResolveOrderId and nextResolveTime
            //remember to + 86400 to the update time of the nextResolve conflict as it is one day
        }

        _;
    }

    function addCustomer(string memory customerAddress)
        public
        returns (address)
    {
        customer memory newCustomer = customer(0, customerAddress, true);
        customers[msg.sender] = newCustomer;
        return (msg.sender);
    }

    function addRider() public returns (address) {
        rider memory newRider = rider(0, true);
        riders[msg.sender] = newRider;
        return (msg.sender);
    }

    function createOrder(
        string memory _restaurant,
        uint256 _deliveryFee,
        string memory _deliveryAddress,
        string[] memory _itemNames,
        uint256[] memory _itemQuantities
    ) public customerOnly returns (uint256) {
        require(
            _itemNames.length == _itemQuantities.length,
            "itemNames and itemQuantities not of same length"
        );

        //create order
        order memory newOrder =
            order(
                msg.sender,
                address(0),
                orderIDCounter,
                _deliveryFee,
                _restaurant,
                _itemNames,
                _itemQuantities,
                false,
                now
            );
        orders[orderIDCounter] = newOrder;
        orderIDCounter++;

        // Update delivery address of customer
        customers[msg.sender].deliveryAddress = _deliveryAddress;
        return (orderIDCounter - 1);
    }

    //update order deliveryFee
    function updateOrder(uint256 orderId, uint256 _deliveryFee)
        public
        ownOrderOnly(orderId)
    {
        require(
            orders[orderId].rider == address(0),
            "Already picked up by rider"
        );
        orders[orderId].deliveryFee = _deliveryFee;
    }

    //delete order
    function deleteOrder(uint256 orderId) public ownOrderOnly(orderId) {
        require(
            orders[orderId].rider == address(0),
            "Already picked up by rider"
        );
        delete orders[orderId];
    }

    function getItemQuantity(uint256 orderId, string memory itemName)
        public
        view
        returns (uint256)
    {
        string[] memory itemNames = orders[orderId].itemNames;
        for (uint256 i = 0; i < itemNames.length; i++) {
            string memory temp = orders[orderId].itemNames[i];
            if (keccak256(bytes(temp)) == keccak256(bytes(itemName))) {
                return orders[orderId].itemQuantities[i];
            }
        }
    }

    function getOwnOrders() public view customerOnly returns (order[] memory filteredOrders) {
        order[] memory ordersTemp = new order[](orderIDCounter - 1);
        uint256 count;
        for (uint256 i = 0; i < orderIDCounter - 1; i++) {
            if (orders[i].customer == msg.sender) {
                ordersTemp[count] = orders[i];
                count += 1;
            }
        }
        filteredOrders = new order[](count);
        for (uint256 i = 0; i < count; i++) {
            filteredOrders[i] = ordersTemp[i];
        }
        return filteredOrders;
    }

    function fileComplaint(string memory _complaint, uint256 _orderId)
        public
        registeredUserOnly
        returns (string memory)
    {
        require(
            orders[_orderId].customer == msg.sender ||
                orders[_orderId].rider == msg.sender,
            "You are not invovled in the orderId"
        );
        require(
            !orders[_orderId].delivered,
            "Delievery has already been confirmed by both rider and customer, complaint can no longer be filed"
        );

        //create conflict
        conflict storage _conflict = conflicts[_orderId];
        if (orders[_orderId].customer == msg.sender) {
            require(
                bytes(conflicts[_orderId].customerComplaint).length == 0,
                "You have already filed and recorded your complaint"
            );
            _conflict.customerComplaint = _complaint;
            _conflict.riderComplaint = "";
        } else if (orders[_orderId].rider == msg.sender) {
            require(
                bytes(conflicts[_orderId].riderComplaint).length == 0,
                "You have already filed and recorded your complaint"
            );
            _conflict.riderComplaint = _complaint;
            _conflict.customerComplaint = "";
        }
        _conflict.customerVotes = 0;
        _conflict.riderVotes = 0;
        _conflict.updateTime = now;
        _conflict.resolved = false;
        if (
            bytes(conflicts[_orderId].customerComplaint).length != 0 &&
            bytes(conflicts[_orderId].riderComplaint).length != 0
        ) {
            _conflict.votingNeeded = true;
        } else {
            _conflict.votingNeeded = false;
        }

        return ("Successfully Filed Complaint");
    }

    function voteConflict(
        //true for customer, false for rider
        bool _vote,
        uint256 _orderId
    ) public registeredUserOnly returns (string memory) {
        require(
            conflicts[_orderId].votingNeeded,
            "Voting not required for OrderId"
        );
        require(
            !conflicts[_orderId].voted[msg.sender],
            "You have already voted"
        );

        //create conflict
        if (_vote) {
            conflicts[_orderId].customerVotes++;
        } else if (!_vote) {
            conflicts[_orderId].riderVotes++;
        }
        return ("Successfully Voted");
    }
}
