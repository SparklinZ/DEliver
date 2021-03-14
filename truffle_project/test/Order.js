var Order = artifacts.require('./Order.sol');
var ERC20 = artifacts.require("./ERC20.sol");
const truffleAssert = require('truffle-assertions');

contract('Order', function(accounts) {
  let orderInstance;
  let erc20Instance;
  let platform = accounts[0]
  let customerAccount = accounts[1];
  let riderAccount = accounts[2];

  before(async () => {
    erc20Instance = await ERC20.deployed(); 
    orderInstance = await Order.new(erc20Instance.address,{
        from: platform
    });
  });

  describe('Register Customers and Riders', function() {
    it('Should be able to add customer', async() => {
        await orderInstance.addCustomer("Novena",{ from: customerAccount})
        .then(() => orderInstance.customers.call(customerAccount))
        .then((result) => {
            assert.strictEqual(result.exist,true,"Customer not registered");
        })
    });

    it('Should be able to add rider', async() => {
        await orderInstance.addRider({ from: riderAccount})
        .then(() => orderInstance.riders.call(riderAccount))
        .then((result) => {
            assert.strictEqual(result.exist,true,"Rider not registered")
        })
    });
  });

  describe('Create Orders', function() {
    it('Should be able to create order', async() => {
        let deliveryFee = 1000000000000000000n;
        await orderInstance.createOrder("McDonalds", deliveryFee, "Orchard", { from: customerAccount })
        let order = await orderInstance.orders.call(0);
        let customer = await orderInstance.customers.call(customerAccount);

        assert.strictEqual(order.customer,customerAccount, "Incorrect customer property");
        assert.strictEqual(order.deliveryFee.toString(), deliveryFee.toString(), "Incorrect delivery fee property");
        assert.strictEqual(order.restaurant, "McDonalds", "Incorrect restaurant property");
        assert.strictEqual(order.delivered, false, "Incorrect delivered property");
        assert.strictEqual(customer.deliveryAddress,"Orchard", "Delivery address of customer not updated");        
    });

    it('Should not be able to create order if not a customer', async() => {
        let deliveryFee = 10000000;
        await truffleAssert.reverts(
            orderInstance.createOrder("McDonalds", deliveryFee, "Orchard", {
                from: riderAccount
            }),
            "Customer only"
        );
    });
  });

});