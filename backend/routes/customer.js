var express = require('express');
var router = express.Router();
var truffleContract = require('truffle-contract')
var Web3 = require('web3')
var web3 = new Web3('ws://localhost:7545')
var orderJson = require("../../truffle_project/build/contracts/Order.json")
var Order = truffleContract(orderJson)
Order.setProvider(web3.currentProvider)


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/addCustomer', async function (req, res, next) {
  var order = await Order.deployed();
  accts = await web3.eth.getAccounts();
  try {
    await order.addCustomer.call(req.body.deliveryAddress, { from: accts[req.body.user] })
      .then((_result) => {
        console.log(_result)
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
router.get('/createOrder', async function (req, res, next) {
  var order = await Order.deployed();
  accts = await web3.eth.getAccounts();
  try {
    console.log(req.body.itemQuantities)
    await order.createOrder.call(req.body.restaurant, req.body.deliveryFee, req.body.deliveryAddress, req.body.itemNames, req.body.itemQuantities, { from: accts[req.body.user] })
    .then(result =>{
      order.createOrder(req.body.restaurant, req.body.deliveryFee, req.body.deliveryAddress, req.body.itemNames, req.body.itemQuantities, { from: accts[req.body.user] });
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

router.get('/updateOrder', async function (req, res, next) {
  var order = await Order.deployed();
  accts = await web3.eth.getAccounts();
  try {
    await order.updateOrder(req.body.orderId, { from: accts[req.body.user] })
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
router.get('/deleteOrder', async function (req, res, next) {
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

router.get('/getItemQuantity', async function (req, res, next) {
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

router.get('/getNotPickedUpOrders', async function (req, res, next) {
  var order = await Order.deployed();
  accts = await web3.eth.getAccounts();
  try {
    await order.getOwnOrders.call({ from: accts[req.body.user] })
      .then(result => {
        console.log(result);
        res.status(200);
        res.send(result);
      })
  } catch (err) {
    res.status(500)
    res.render('error', { error: err })
  }
});

module.exports = router;