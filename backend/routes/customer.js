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

//req.body user 1-10
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
    await order.createOrder.call(req.body.restaurant, req.body.fee, req.body.deliveryAddress, { from: accts[req.body.user] })
      .then(orderId => {
        order.createOrder(req.body.restaurant, req.body.fee, req.body.deliveryAddress, { from: accts[req.body.user] });
        return orderId;
      }).then(orderId => {
        res.status(200);
        res.send(orderId);
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
    await order.deleteOrder({ from: accts[req.body.user] })
      .then(result => {
        res.status(200);
        res.send(result);
      })
  } catch (err) {
    res.status(500)
    res.render('error', { error: err })
  }
});

router.get('/addItem', async function (req, res, next) {
  var order = await Order.deployed();
  accts = await web3.eth.getAccounts();
  try {
    await order.addItem(req.body.orderId, req.body.itemName, req.body.quantity, { from: accts[req.body.user] })
      .then(result => {
        res.status(200);
        res.send(result);
      })
  } catch (err) {
    res.status(500)
    res.render('error', { error: err })
  }
});

router.get('/removeItem', async function (req, res, next) {
  var order = await Order.deployed();
  accts = await web3.eth.getAccounts();
  try {
    await order.removeItem(req.body.orderId, req.body.itemName, { from: accts[req.body.user] })
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

router.get('/reviewOrder', async function (req, res, next) {
  var order = await Order.deployed();
  accts = await web3.eth.getAccounts();
  try {
    await order.reviewOrder.call(req.body.orderId, { from: accts[req.body.user] })
    .then(result =>{
      order.reviewOrder(req.body.orderId, { from: accts[req.body.user] });
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

router.get('/testing', async function (req, res, next) {
  var order = await Order.deployed();
  accts = await web3.eth.getAccounts();
  try {
    await order.addCustomer('somewhere', { from: accts[1] })
    .then(() => order.createOrder2.call('MickeyDs','150','JE',['burgerA','burgerB'],[3,7], { from: accts[1] }))
    .then(result =>{
      order.createOrder2('MickeyDs','150','JE',['burgerA','burgerB'],[3,7], { from: accts[1] });
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

module.exports = router;
