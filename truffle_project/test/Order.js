var Order = artifacts.require('./Order.sol');
const truffleAssert = require('truffle-assertions');

contract('Order', function(accounts) {
  let orderInstance;
  let platform = accounts[0]
  let customerAccount = accounts[1];
  let riderAccount = accounts[2];

  before(async () => {
    orderInstance = await Order.new({
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
        let itemNames = ["McChicken", "McSpicy"];
        let itemQuantities = [1, 2];
        let foodFee = 2000000000000000000n;
        let orderNumber = await orderInstance.createOrder.call("McDonalds", "Orchard", itemNames, itemQuantities, deliveryFee, foodFee, 
        {from: customerAccount, value: web3.utils.toWei('3', 'ether')});
        
        assert.strictEqual(orderNumber.toNumber(), 1, "Incorrect Order ID");
    });

    it('Should not be able to create order if not a customer', async() => {
      let deliveryFee = 1000000000000000000n;
      let itemNames = ["McChicken", "McSpicy"];
      let itemQuantities = [1, 2];
      let foodFee = 2000000000000000000n;
      await truffleAssert.reverts(orderInstance.createOrder("McDonalds", "Orchard", itemNames, itemQuantities, deliveryFee, foodFee, 
      {from: riderAccount, value: web3.utils.toWei('3', 'ether')}), "Customer only");
    });
  });

  describe('Update Order Delivery Fee', function() {
    it('Should be able to update order delivery fee', async() => {
      await orderInstance.createOrder("McDonalds", "Orchard", 
      ["McChicken", "McSpicy"], [1, 2], 1000000000000000000n, 2000000000000000000n, 
      {from: customerAccount, value: web3.utils.toWei('3', 'ether')});
      
      let result = await orderInstance.updateOrder(1, {from: customerAccount});
      truffleAssert.eventEmitted(result, "updateOrderDeliveryFee");
    })
  })

  describe('Delete Order', function() {
    it('Should be able to delete an order', async() => {
        let result = await orderInstance.deleteOrder(1, {from: customerAccount});
        truffleAssert.eventEmitted(result, "deleteOrderEvent");
    });
  });

  describe('Riders Functions', function() {
    it('Should be able to get all orders', async() => {
      await orderInstance.createOrder("McDonalds", "Orchard", 
      ["McChicken", "McSpicy"], [1, 2], 1000000000000000000n, 2000000000000000000n, 
      {from: customerAccount, value: web3.utils.toWei('3', 'ether')});

      let result = await orderInstance.getOrders.call({from: riderAccount});
      assert.strictEqual(result.length, 2, "Invalid number of orders");
    });

    it('Should not be able to get all orders if not rider', async() => {
      await truffleAssert.reverts(orderInstance.getOrders({from: customerAccount}), "Rider only");
    });

    it('Should not be able to pickup orders if not rider', async() => {
      await truffleAssert.reverts(orderInstance.pickupOrder(2, {from: customerAccount}), "Rider only");
    });

    it('Should be able to get own orders', async() => {
      await orderInstance.pickupOrder(2, {from: riderAccount});
      let result = await orderInstance.getOwnOrdersRider({from: riderAccount});
      let orders = result[0];
      assert.strictEqual(orders.length, 1, "Invalid number of own orders");
      assert.strictEqual(orders[0].rider, riderAccount, "Incorrect own order");
    });

    it('Should not be able to get own orders if not rider', async() => {
      await truffleAssert.reverts(orderInstance.getOwnOrdersRider({from: customerAccount}), "Rider only");
    })
  });

  describe('Customers Functions', function() {
    it('Should be able to get own orders', async() => {
      let result = await orderInstance.getOwnOrders({from: customerAccount});
      let orders = result[0];
      assert.strictEqual(orders.length, 1, "Invalid number of own orders");
      assert.strictEqual(orders[0].customer, customerAccount, "Incorrect own order");
    });

    it('Should not be able to get own orders if not customer', async() => {
      await truffleAssert.reverts(orderInstance.getOwnOrders({from: riderAccount}), "Customer only");
    });
  });

  describe('Conflicts', function() {
    it('Should be able to file a complaint', async() => {
      let result = await orderInstance.fileComplaint.call("Did not arrive", 2, {from: customerAccount});
      assert.strictEqual(result.toString(), "Successfully Filed Complaint", "Complaint not successful");
    })
  });
});