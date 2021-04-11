pragma experimental ABIEncoderV2;
pragma solidity ^0.5.0;

contract Order {
    struct customer {
        uint256 complaints;
        uint256 conflictWin;
        uint256 conflictLoss;
        uint256 successful;
        string deliveryAddress;
        bool exist;
    }

    struct rider {
        uint256 complaints;
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
        uint256 foodFee;
        string deliveryAddress;
        string restaurant;
        // item name to quantity
        string[] itemNames;
        uint256[] itemQuantities;
        bool delivered;
        uint256 orderTime;
        uint256 deliveredTime;
        bool exist;
    }

    struct conflict {
        bool exist;
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

    //uncomplete

    // orderID => Conflict struct
    mapping(uint256 => conflict) private conflicts;
    mapping(address => customer) public customers;
    mapping(address => rider) public riders;
    // orderID => Order struct
    mapping(uint256 => order) private orders;

    uint256 orderIDCounter = 1;

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
            if (!conflicts[nextResolveOrderId].votingNeeded) {
                if (
                    bytes(conflicts[nextResolveOrderId].customerComplaint)
                        .length == 0
                ) {
                    address payable _rider =
                        address(uint160(orders[nextResolveOrderId].rider));
                    _rider.transfer(orders[nextResolveOrderId].deliveryFee+orders[nextResolveOrderId].foodFee);
                    customers[orders[nextResolveOrderId].customer].complaints++;
                } else if (
                    bytes(conflicts[nextResolveOrderId].riderComplaint)
                        .length == 0
                ) {
                    //transfer money to customer
                    address payable _customer =
                        address(uint160(orders[nextResolveOrderId].customer));
                    _customer.transfer(orders[nextResolveOrderId].deliveryFee+orders[nextResolveOrderId].foodFee);
                    riders[orders[nextResolveOrderId].rider].complaints++;
                }
            } else if (conflicts[nextResolveOrderId].votingNeeded) {
                if (
                    conflicts[nextResolveOrderId].customerVotes >=
                    conflicts[nextResolveOrderId].riderVotes
                ) {
                    //transfer money to customer
                    address payable _customer =
                        address(uint160(orders[nextResolveOrderId].customer));
                    _customer.transfer(orders[nextResolveOrderId].deliveryFee+orders[nextResolveOrderId].foodFee);
                    riders[orders[nextResolveOrderId].rider].conflictLoss++;
                    customers[orders[nextResolveOrderId].customer]
                        .conflictWin++;
                } else {
                    //transfer money to rider
                    address payable _rider =
                        address(uint160(orders[nextResolveOrderId].rider));
                    _rider.transfer(orders[nextResolveOrderId].deliveryFee+orders[nextResolveOrderId].foodFee);
                    riders[orders[nextResolveOrderId].rider].conflictWin++;
                    customers[orders[nextResolveOrderId].customer]
                        .conflictLoss++;
                }
            }
            conflicts[nextResolveOrderId].resolved = true;
            conflicts[nextResolveOrderId].votingNeeded = false;
            //find the next conflict that requires resolution and update the nextResolveOrderId and nextResolveTime
            //remember to + 86400 to the update time of the nextResolve conflict as it is one day
            nextResolveOrderId = 0;
            for (uint256 i = 1; i < orderIDCounter; i++) {
                if (conflicts[i].votingNeeded && !conflicts[i].resolved) {
                    nextResolveOrderId = i;
                    nextResolveTime = conflicts[i].updateTime + 86400;
                    break;
                }
            }
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

    function isCustomer() public view registeredUserOnly() returns (bool) {
        return customers[msg.sender].exist;
    }

    function createOrder(
        string memory _restaurant,
        string memory _deliveryAddress,
        string[] memory _itemNames,
        uint256[] memory _itemQuantities,
        uint256 deliveryFee,
        uint256 foodFee
    ) public payable customerOnly returns (uint256) {
        require(
            _itemNames.length == _itemQuantities.length,
            "itemNames and itemQuantities not of same length"
        );
        require(
            msg.value == deliveryFee+foodFee, "Fee incorrect"
        );
        //create order
        order memory newOrder =
            order(
                msg.sender,
                address(0),
                orderIDCounter,
                deliveryFee,
                foodFee,
                _deliveryAddress,
                _restaurant,
                _itemNames,
                _itemQuantities,
                false,
                now,
                0,
                true
            );
        orders[orderIDCounter] = newOrder;
        orderIDCounter++;

        // Update delivery address of customer
        customers[msg.sender].deliveryAddress = _deliveryAddress;
        return (orderIDCounter - 1);
    }

    //update order deliveryFee
    function updateOrder(uint256 orderId) public payable ownOrderOnly(orderId) {
        require(
            orders[orderId].rider == address(0),
            "Already picked up by rider"
        );
        msg.sender.transfer(orders[orderId].deliveryFee);
        orders[orderId].deliveryFee = msg.value;
    }

    //delete order
    function deleteOrder(uint256 orderId) public ownOrderOnly(orderId) {
        require(
            orders[orderId].rider == address(0),
            "Already picked up by rider"
        );
        msg.sender.transfer(orders[orderId].deliveryFee+orders[nextResolveOrderId].foodFee);
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
        riderOnly
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
        returns (order[] memory filteredOrders, uint256[] memory ordersConflicts)
    {
        order[] memory ordersTemp = new order[](orderIDCounter - 1);
        uint256[] memory conflictsTemp = new uint256[](orderIDCounter - 1);
        uint256 count;
        for (uint256 i = 1; i < orderIDCounter; i++) {
            if (orders[i].customer == msg.sender) {
                ordersTemp[count] = orders[i];
                if(conflicts[i].exist){
                    if(bytes(conflicts[i].customerComplaint).length != 0 && bytes(conflicts[i].riderComplaint).length != 0){
                        conflictsTemp[count] = 3;
                    }else if(bytes(conflicts[i].customerComplaint).length == 0){
                        conflictsTemp[count] = 2;
                    }else{
                        conflictsTemp[count] = 1;
                    }
                }else{
                    conflictsTemp[count] = 0;
                }
                count += 1;
            }
        }
        filteredOrders = new order[](count);
        ordersConflicts = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            filteredOrders[i] = ordersTemp[i];
            ordersConflicts[i] = conflictsTemp[i];
        }
        return (filteredOrders, ordersConflicts);
    }

    function getOwnOrdersRider()
        public
        view
        riderOnly
        returns (order[] memory filteredOrders)
    {
        order[] memory ordersTemp = new order[](orderIDCounter - 1);
        uint256 count;
        for (uint256 i = 1; i < orderIDCounter; i++) {
            if (orders[i].rider == msg.sender) {
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
            "Delivery has already been confirmed by both rider and customer, complaint can no longer be filed"
        );
        
        if (!conflicts[_orderId].exist) {
            //create conflict
            conflict memory _conflict =
                conflict(true, "", "", false, 0, 0, now, false);
            if (orders[_orderId].customer == msg.sender) {
                require(
                    bytes(conflicts[_orderId].customerComplaint).length == 0,
                    "You have already filed and recorded your complaint"
                );
                require(
                    orders[_orderId].rider != address(0),
                    "No one to complain about as delivery not picked up yet"
                );
                _conflict.customerComplaint = _complaint;
            } else if (orders[_orderId].rider == msg.sender) {
                require(
                    bytes(conflicts[_orderId].riderComplaint).length == 0,
                    "You have already filed and recorded your complaint"
                );
                _conflict.riderComplaint = _complaint;
            }
            _conflict.exist = true;
            conflicts[_orderId] = _conflict;
        }else if(conflicts[_orderId].exist){
            require(!conflicts[_orderId].votingNeeded, "You have already filed your complaint");
            if (orders[_orderId].customer == msg.sender) {
                require(
                    bytes(conflicts[_orderId].customerComplaint).length == 0,
                    "You have already filed and recorded your complaint"
                );
                conflicts[_orderId].customerComplaint = _complaint;
            } else if (orders[_orderId].rider == msg.sender) {
                require(
                    bytes(conflicts[_orderId].riderComplaint).length == 0,
                    "You have already filed and recorded your complaint"
                );
                conflicts[_orderId].riderComplaint = _complaint;
            }
            conflicts[_orderId].votingNeeded = true;
            conflicts[_orderId].updateTime = now;
            if (nextResolveOrderId == 0) {
                nextResolveOrderId = _orderId;
                nextResolveTime = conflicts[_orderId].updateTime + 86400;
            }
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
            string[] memory filteredRiderComplaints,
            uint256[] memory filteredTotalVotes
        )
    {
        order[] memory ordersTemp = new order[](orderIDCounter - 1);
        string[] memory customerComplaints = new string[](orderIDCounter - 1);
        string[] memory riderComplaints = new string[](orderIDCounter - 1);
        uint256[] memory totalVotes = new uint256[](orderIDCounter - 1);
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
                totalVotes[count] =
                    conflicts[i].customerVotes +
                    conflicts[i].riderVotes;
                count += 1;
            }
        }
        filteredOrders = new order[](count);
        filteredCustComplaints = new string[](count);
        filteredRiderComplaints = new string[](count);
        filteredTotalVotes = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            filteredOrders[i] = ordersTemp[i];
            filteredCustComplaints[i] = customerComplaints[i];
            filteredRiderComplaints[i] = riderComplaints[i];
            filteredTotalVotes[i] = totalVotes[i];
        }
        return (
            filteredOrders,
            filteredCustComplaints,
            filteredRiderComplaints,
            filteredTotalVotes
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
        conflicts[_orderId].voted[msg.sender] = true;
        return ("Successfully Voted");
    }

    //Riders pick up order
    function pickupOrder(uint256 orderId) public riderOnly() {
        require(
            orders[orderId].rider == address(0),
            "Order already picked up by another rider"
        );
        require(
            orders[orderId].exist == true,
            "Order must exist"
        );
        orders[orderId].rider = msg.sender;
    }

    //Customer receives order
    function receivedOrder(uint256 orderId) public ownOrderOnly(orderId){
        require(orders[orderId].rider != address(0), "No rider");
        require(orders[orderId].delivered == false, "Already received");
        address payable _rider = address(uint160(orders[orderId].rider));
        _rider.transfer(orders[orderId].deliveryFee+orders[nextResolveOrderId].foodFee);
        orders[orderId].delivered = true;
        customers[orders[orderId].customer].successful++;
        riders[orders[orderId].rider].successful++;
    }
}
