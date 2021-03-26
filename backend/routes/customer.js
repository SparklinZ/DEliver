const e = require('express');
var express = require('express');
var router = express.Router();
var truffleContract = require('truffle-contract')
var Web3 = require('web3')
var web3 = new Web3('ws://localhost:8545')
var orderJson = require("../../truffle_project/build/contracts/Order.json")
var Order = truffleContract(orderJson)
Order.setProvider(web3.currentProvider)

router.post('/addCustomer', async function (req, res, next) {
  var order = await Order.deployed();
  accts = await web3.eth.getAccounts();
  try {
    await order.addCustomer.call(req.body.deliveryAddress, { from: accts[req.body.user] })
      .then((_result) => {
        if (_result == accts[req.body.user]) {
          order.addCustomer(req.body.deliveryAddress, { from: accts[req.body.user] });
          return _result
        }
      }).then(result => {
        res.status(200);
        res.send(result);
      })
  } catch (err) {
    res.status(500)
    res.render('error', { error: err })
  }
});

//req.body user 1-10
router.post('/createOrder', async function (req, res, next) {
  var order = await Order.deployed();
  accts = await web3.eth.getAccounts();
  try {
    await order.createOrder.call(req.body.restaurant, req.body.deliveryAddress, req.body.itemNames, req.body.itemQuantities, { from: accts[req.body.user], value: req.body.deliveryFee })
      .then(result => {
        order.createOrder(req.body.restaurant, req.body.deliveryAddress, req.body.itemNames, req.body.itemQuantities, { from: accts[req.body.user], value: req.body.deliveryFee });
        return result;
      })
      .then(result => {
        res.status(200);
        res.send(result);
      })
  } catch (err) {
    res.status(500)
    res.render('error', { error: err })
  }
});

router.post('/updateOrder', async function (req, res, next) {
  var order = await Order.deployed();
  accts = await web3.eth.getAccounts();
  try {
    await order.updateOrder(req.body.orderId, { from: accts[req.body.user], value: req.body.deliveryFee})
      .then(result => {
        res.status(200);
        res.send(result);
      })
  } catch (err) {
    res.status(500)
    res.render('error', { error: err })
  }
});

//req.body user 1-10
router.post('/deleteOrder', async function (req, res, next) {
  var order = await Order.deployed();
  accts = await web3.eth.getAccounts();
  try {
    await order.deleteOrder(req.body.orderId, { from: accts[req.body.user] })
      .then(result => {
        res.status(200);
        res.send(result);
      })
  } catch (err) {
    res.status(500)
    res.render('error', { error: err })
  }
});

router.post('/getItemQuantity', async function (req, res, next) {
  var order = await Order.deployed();
  accts = await web3.eth.getAccounts();
  try {
    await order.getItemQuantity.call(req.body.orderId, req.body.itemName, { from: accts[req.body.user] })
      .then(result => {
        res.status(200);
        res.send(result);
      })
  } catch (err) {
    res.status(500)
    res.render('error', { error: err })
  }
});

router.post('/getNotPickedUpOrders', async function (req, res, next) {
  var order = await Order.deployed();
  accts = await web3.eth.getAccounts();
  var orderItem, holder;
  try {
    await order.getOwnOrders.call({ from: accts[req.body.user] })
      .then(result => {
        result = result.filter(order => order["rider"] == "0x0000000000000000000000000000000000000000");
        return result
      })
      .then(result => {
        holder = [];
        result.forEach(elem =>{
          orderItem = {};
          orderItem.orderId = elem.orderId;
          orderItem.restaurant = elem.restaurant;
          orderItem.deliveryFee = elem.deliveryFee;
          orderItem.deliveryAddress = elem.deliveryAddress;
          orderItem.itemNames = elem.itemNames;
          orderItem.itemQuantities = elem.itemQuantities;
          orderItem.orderTime = elem.orderTime;
          holder.push(orderItem);
        })
        return holder;
      })
      .then(result => {
        res.status(200);
        res.send(result);
      })
  } catch (err) {
    res.status(500)
    res.render('error', { error: err })
  }
});

router.post('/getPickedUpOrders', async function (req, res, next) {
  var order = await Order.deployed();
  accts = await web3.eth.getAccounts();
  var orderItem, holder;
  try {
    await order.getOwnOrders.call({ from: accts[req.body.user] })
      .then(result => {
        result = result.filter(order => order["rider"] != "0x0000000000000000000000000000000000000000" && !order["delivered"]);
        return result
      })
      .then(result => {
        holder = [];
        result.forEach(elem =>{
          orderItem = {};
          orderItem.orderId = elem.orderId;
          orderItem.rider = elem.rider;
          orderItem.restaurant = elem.restaurant;
          orderItem.deliveryFee = elem.deliveryFee;
          orderItem.deliveryAddress = elem.deliveryAddress;
          orderItem.itemNames = elem.itemNames;
          orderItem.itemQuantities = elem.itemQuantities;
          orderItem.orderTime = elem.orderTime;
          holder.push(orderItem);
        })
        return holder;
      })
      .then(result => {
        res.status(200);
        res.send(result);
      })
  } catch (err) {
    res.status(500)
    res.render('error', { error: err })
  }
});

router.post('/getOrderToken', async function (req, res, next) {
  var order = await Order.deployed();
  accts = await web3.eth.getAccounts();
  try {
    await order.getOrderToken.call(req.body.orderId, { from: accts[req.body.user] })
      .then(result => {
        var orderItem = {};
        orderItem.orderId = result[0].orderId;
        orderItem.token = result[1];
        orderItem.rider = result[0].rider;
        orderItem.restaurant = result[0].restaurant;
        orderItem.deliveryFee = result[0].deliveryFee;
        orderItem.deliveryAddress = result[0].deliveryAddress;
        orderItem.itemNames = result[0].itemNames;
        orderItem.itemQuantities = result[0].itemQuantities;
        orderItem.orderTime = result[0].orderTime;
        return orderItem
      })
      .then(result => {
        res.status(200);
        res.send(result);
      })
  } catch (err) {
    res.status(500)
    res.render('error', { error: err })
  }
});

module.exports = router;