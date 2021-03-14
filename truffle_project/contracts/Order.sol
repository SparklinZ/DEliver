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
        mapping(string => uint256) items;
        bool delivered;
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

    // Time to resolve next conflict
    uint256 nextResolve;
    // orderID => Conflict struct
    mapping(uint256 => conflict) public conflicts;
    mapping(address => customer) public customers;
    mapping(address => rider) public riders;
    // orderID => Order struct
    mapping(uint256 => order) public orders;
    // orderID => customer_token
    mapping(uint256 => uint256) private customerTokens;

    ERC20 erc20;
    uint256 orderIDCounter = 0;

    modifier customerOnly() {
        require(customers[msg.sender].exist, "Customer only");
        _;
    }

    modifier ownOrderOnly(uint256 orderId) {
        require(
            orders[orderId].customer == msg.sender,
            "Can edit own orders only"
        );
        _;
    }

    constructor(ERC20 erc20address) public {
        erc20 = erc20address;
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
        string memory _deliveryAddress
    ) public customerOnly returns (uint256) {
        order storage newOrder = orders[orderIDCounter];
        newOrder.customer = msg.sender;
        newOrder.orderId = orderIDCounter;
        newOrder.deliveryFee = _deliveryFee;
        newOrder.restaurant = _restaurant;
        newOrder.delivered = false;
        newOrder.items[""] = 0;

        orderIDCounter++;

        // Update delivery address of customer
        customers[msg.sender].deliveryAddress = _deliveryAddress;

        return (orderIDCounter - 1);
    }

    function reviewOrder(uint256 orderId)
        public
        view
        returns (
            address _customer,
            address _rider,
            uint256 _deliveryFee,
            string memory _restaurant
        )
    {
        order memory currOrder = orders[orderId];
        return (
            currOrder.customer,
            currOrder.rider,
            currOrder.deliveryFee,
            currOrder.restaurant
        );
    }
}
