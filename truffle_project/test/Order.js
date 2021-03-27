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

  describe('Add item to order', function() {
    it('Should be able to add an item', async() => {
        await orderInstance.addItem(0, "McChicken", 1, {from: customerAccount});
        let quantity = await orderInstance.getItemQuantity.call(0, "McChicken");

        assert.strictEqual(quantity.toNumber(), 1, "Incorrect item quantity");
    });

    it('Should not be able to add an item if quantity specified is zero', async() => {
      await truffleAssert.reverts(
        orderInstance.addItem(0, "McChicken", 0, {
            from: customerAccount
        }),
        "Invalid quantity"
      );
    });

    it('Should not be able to add an item if not the owner of order', async() => {
      await truffleAssert.reverts(
        orderInstance.addItem(0, "McChicken", 1, {
            from: riderAccount
        }),
        "Can edit own orders only"
      );
    });
  });

  describe('Remove item from order', function() {
    it('Should be able to remove an item', async() => {
        await orderInstance.removeItem(0, "McChicken", {from: customerAccount});
        let quantity = await orderInstance.getItemQuantity.call(0, "McChicken");

        assert.strictEqual(quantity.toNumber(), 0, "Incorrect item quantity");
    });

    it('Should not be able to remove an item if not the owner of order', async() => {
      await truffleAssert.reverts(
        orderInstance.removeItem(0, "McChicken", {
            from: riderAccount
        }),
        "Can edit own orders only"
      );
    });
  });

  describe('Delete Order', function() {
    it('Should be able to delete an order', async() => {
        await orderInstance.deleteOrder(0, {from: customerAccount})
        .then(() => orderInstance.orders.call(0))
        .then((order) => {
          assert.equal(order.customer.valueOf(), 0, "Deletion not successful");
        });
    });
  });

});