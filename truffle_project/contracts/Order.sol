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
    uint256 orderIDCounter = 1;

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

        orderIDCounter++;

        // Update delivery address of customer
        customers[msg.sender].deliveryAddress = _deliveryAddress;

        return (orderIDCounter - 1);
    }

    function deleteOrder(uint256 orderId) public ownOrderOnly(orderId) {
        delete orders[orderId];
    }

    // function addItem(
    //     uint256 orderId,
    //     string memory itemName,
    //     uint256 quantity
    // ) public ownOrderOnly(orderId) {
    //     //quantity has to be more than 0
    //     require(quantity > 0, "Invalid quantity");

    //     //add item into mapping of the order
    //     orders[orderId].items[itemName] = quantity;
    // }

    // function removeItem(uint256 orderId, string memory itemName)
    //     public
    //     ownOrderOnly(orderId)
    // {
    //     //add item into mapping of the order
    //     orders[orderId].items[itemName] = 0;
    // }

    function getItemQuantity(uint256 orderId, string memory itemName)
        public
        view
        returns (uint256)
    {
        string[] memory itemNames = orders[orderId].itemNames;
        for(uint i=0; i<itemNames.length;i++){
            string memory temp = orders[orderId].itemNames[i];
            if(keccak256(bytes(temp)) == keccak256(bytes(itemName))){
                return orders[orderId].itemQuantities[i];
            }
        }
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

    function createOrder2(
        string memory _restaurant,
        uint256 _deliveryFee,
        string memory _deliveryAddress,
        string[] memory itemNames,
        uint256[] memory itemQuantities
    ) public customerOnly returns (uint256) {
        require(itemNames.length == itemQuantities.length, "itemNames and itemQuantities not of same length");
        //create items
        string[] memory _itemNames = itemNames;
        uint256[] memory _itemQuantities = itemQuantities;

        //create order
        order memory newOrder = order(msg.sender, address(0), orderIDCounter, _deliveryFee, _restaurant, _itemNames, _itemQuantities, false);
        orders[orderIDCounter] = newOrder;
        orderIDCounter++;

        // Update delivery address of customer
        customers[msg.sender].deliveryAddress = _deliveryAddress;

        return (orderIDCounter - 1);
    }
}
