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

    constructor(ERC20 erc20address) public {
        erc20 = erc20address;
    }

    function addCustomer(string memory customerAddress) public {
        customer memory newCustomer = customer(0, customerAddress, true);
        customers[msg.sender] = newCustomer;
    }
}
