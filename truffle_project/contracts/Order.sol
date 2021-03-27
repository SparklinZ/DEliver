pragma experimental ABIEncoderV2;
pragma solidity ^0.5.0;

contract Order {
    struct customer {
        uint256 complained;
        uint256 conflictWin;
        uint256 conflictLoss;
        uint256 successful;
        string deliveryAddress;
        bool exist;
    }

    struct rider {
        uint256 complained;
        uint256 conflictWin;
        uint256 conflictLoss;
        uint256 successful;
        bool exist;
    }

    struct order {
        address customer;
        address rider;
        uint256 orderId;
        uint256 deliveryFee;
        string deliveryAddress;
        string restaurant;
        // item name to quantity
        string[] itemNames;
        uint256[] itemQuantities;
        bool delivered;
        bool received;
        uint256 orderTime;
        uint256 deliveredTime;
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
    mapping(uint256 => conflict) private conflicts;
    mapping(address => customer) private customers;
    mapping(address => rider) private riders;
    // orderID => Order struct
    mapping(uint256 => order) private orders;

    uint256 orderIDCounter = 1;

    uint256[] deliveredNotReceived;

    constructor() public {}

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

    modifier riderOnly() {
        require(riders[msg.sender].exist, "Rider only");
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
                address payable _customer = address(uint160(orders[nextResolveOrderId].customer));
                _customer.transfer(orders[nextResolveOrderId].deliveryFee);
            } else {
                //transfer money to rider
                address payable _rider = address(uint160(orders[nextResolveOrderId].rider));
                _rider.transfer(orders[nextResolveOrderId].deliveryFee);
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
        customer memory newCustomer =
            customer(0, 0, 0, 0, customerAddress, true);
        customers[msg.sender] = newCustomer;
        return (msg.sender);
    }

    function addRider() public returns (address) {
        rider memory newRider = rider(0, 0, 0, 0, true);
        riders[msg.sender] = newRider;
        return (msg.sender);
    }

    function createOrder(
        string memory _restaurant,
        string memory _deliveryAddress,
        string[] memory _itemNames,
        uint256[] memory _itemQuantities
    ) public payable customerOnly returns (uint256) {
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
                msg.value,
                _deliveryAddress,
                _restaurant,
                _itemNames,
                _itemQuantities,
                false,
                false,
                now,
                0
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
        payable
        ownOrderOnly(orderId)
    {
        require(
            orders[orderId].rider == address(0),
            "Already picked up by rider"
        );
        msg.sender.transfer(orders[orderId].deliveryFee);
        orders[orderId].deliveryFee = _deliveryFee;
    }

    //delete order
    function deleteOrder(uint256 orderId) public ownOrderOnly(orderId) {
        require(
            orders[orderId].rider == address(0),
            "Already picked up by rider"
        );
        msg.sender.transfer(orders[orderId].deliveryFee);
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

    //For riders to get all orders currently not taken
    function getOrders()
        public
        view
        customerOnly
        returns (order[] memory filteredOrders)
    {
        order[] memory ordersTemp = new order[](orderIDCounter - 1);
        uint256 count;
        for (uint256 i = 1; i < orderIDCounter; i++) {
            if (orders[i].rider == address(0)) {
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

    function getOwnOrders()
        public
        view
        customerOnly
        returns (order[] memory filteredOrders)
    {
        order[] memory ordersTemp = new order[](orderIDCounter - 1);
        uint256 count;
        for (uint256 i = 1; i < orderIDCounter; i++) {
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
            if (nextResolveTime == 0) {
                nextResolveOrderId = _orderId;
                nextResolveTime = _conflict.updateTime + 86400;
            }
        } else {
            _conflict.votingNeeded = false;
        }

        return ("Successfully Filed Complaint");
    }

    function getConflicts()
        public
        view
        registeredUserOnly
        returns (
            order[] memory filteredOrders,
            string[] memory filteredCustComplaints,
            string[] memory filteredRiderComplaints
        )
    {
        order[] memory ordersTemp = new order[](orderIDCounter - 1);
        string[] memory customerComplaints = new string[](orderIDCounter - 1);
        string[] memory riderComplaints = new string[](orderIDCounter - 1);
        uint256 count;
        for (uint256 i = 1; i < orderIDCounter; i++) {
            if (
                orders[i].customer != msg.sender &&
                orders[i].rider != msg.sender &&
                conflicts[i].votingNeeded &&
                !conflicts[i].voted[msg.sender]
            ) {
                ordersTemp[count] = orders[i];
                customerComplaints[count] = conflicts[i].customerComplaint;
                riderComplaints[count] = conflicts[i].riderComplaint;
                count += 1;
            }
        }
        filteredOrders = new order[](count);
        filteredCustComplaints = new string[](count);
        filteredRiderComplaints = new string[](count);
        for (uint256 i = 0; i < count; i++) {
            filteredOrders[i] = ordersTemp[i];
            filteredCustComplaints[i] = customerComplaints[i];
            filteredRiderComplaints[i] = riderComplaints[i];
        }
        return (
            filteredOrders,
            filteredCustComplaints,
            filteredRiderComplaints
        );
    }

    function voteConflict(
        //true for customer, false for rider
        bool _vote,
        uint256 _orderId
    ) public registeredUserOnly returns (string memory) {
        require(
            orders[_orderId].customer != msg.sender &&
                orders[_orderId].rider != msg.sender,
            "Cannot vote for own complaint"
        );
        require(
            conflicts[_orderId].votingNeeded,
            "Voting not required for OrderId"
        );
        require(
            !conflicts[_orderId].voted[msg.sender],
            "You have already voted"
        );

        if (_vote) {
            conflicts[_orderId].customerVotes++;
        } else if (!_vote) {
            conflicts[_orderId].riderVotes++;
        }
        return ("Successfully Voted");
    }

    //Riders pick up order
    function pickupOrder(uint256 orderId) public riderOnly() {
        require(
            orders[orderId].rider == address(0),
            "Order already picked up by another rider"
        );
        orders[orderId].rider = msg.sender;
    }

    //Customer receives order
    function receiveOrder(uint256 orderId) public customerOnly() {
        require(orders[orderId].received == false, "Already received");
        receivedOrder(orderId);
    }

    //Received Order, update order and ives payment, called by receivedOrder and time based
    function receivedOrder(uint256 orderId) private {
        msg.sender.transfer(orders[orderId].deliveryFee);
        orders[orderId].received = true;
        orders[orderId].delivered = true;
        customers[orders[orderId].customer].successful++;
        riders[orders[orderId].rider].successful++;
    }

    //Riders delivered order
    function deliveredOrder(uint256 orderId) public riderOnly() {
        require(
            orders[orderId].delivered == false &&
                orders[orderId].received == false,
            "Already delivered"
        );
        orders[orderId].delivered = true;
        orders[orderId].deliveredTime = now;
        deliveredNotReceived.push(orderId);
    }
}
