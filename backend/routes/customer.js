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
    await order.createOrder.call(req.body.restaurant, req.body.deliveryAddress, req.body.itemNames, req.body.itemQuantities, req.body.deliveryFee, req.body.foodFee, { from: accts[req.body.user], value: req.body.deliveryFee + req.body.foodFee })
      .then(result => {
        order.createOrder(req.body.restaurant, req.body.deliveryAddress, req.body.itemNames, req.body.itemQuantities, req.body.deliveryFee, req.body.foodFee, { from: accts[req.body.user], value: req.body.deliveryFee + req.body.foodFee });
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
        for(i=0;i<result[0].length;i++){
          result[0][i].hasFiledComplain = result[1][i]
        }
        result = result[0]
        result = result.filter(order => order["rider"] == "0x0000000000000000000000000000000000000000");
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
          orderItem.hasFiledComplain = elem.hasFiledComplain;
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
        for(i=0;i<result[0].length;i++){
          //0: no complaint 1: customer filed 2: rider filed 3: both filed
          result[0][i].hasFiledComplain = result[1][i]
        }
        result = result[0]
        result = result.filter(order => order["rider"] != "0x0000000000000000000000000000000000000000");
        result = result.filter(order => order["delivered"] == false);
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
          orderItem.hasFiledComplain = elem.hasFiledComplain;
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

router.post('/receivedOrder', async function (req, res, next) {
  var order = await Order.deployed();
  accts = await web3.eth.getAccounts();
  try {
    await order.receivedOrder(req.body.orderId, { from: accts[req.body.user] })
      .then(result => {
        res.status(200);
        res.send(result);
      })
  } catch (err) {
    res.status(500)
    res.render('error', { error: err })
  }
});

router.post('/isCustomer', async function (req, res, next) {
  var order = await Order.deployed();
  accts = await web3.eth.getAccounts();
  try {
    await order.customers.call(accts[req.body.user])
    .then(cust => {
      result = {}
      if(cust.exist){
        result.customer = true
      }else{
        result.customer = false
      }
      res.status(200);
      res.send(result);
    })
  } catch (err) {
    res.status(500)
    res.render('error', { error: err })
  }
});

router.get('/test', async function (req, res, next) {
  var order = await Order.deployed();
  accts = await web3.eth.getAccounts();
  try {
    
        res.status(200);
        res.send(req.body);
  } catch (err) {
    res.status(500)
    res.render('error', { error: err })
  }
});

module.exports = router;