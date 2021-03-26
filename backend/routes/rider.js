var express = require('express');
var router = express.Router();
var truffleContract = require('truffle-contract')
var Web3 = require('web3')
var web3 = new Web3('ws://localhost:8545')
var orderJson = require("../../truffle_project/build/contracts/Order.json")
var Order = truffleContract(orderJson)
Order.setProvider(web3.currentProvider)

//req.body user 1-10
router.get('/addRider', async function (req, res, next) {
  var order = await Order.deployed();
  accts = await web3.eth.getAccounts();
  try {
    await order.addRider.call({ from: accts[req.body.user] })
      .then((_result) => {
        if (_result == accts[req.body.user]) {
          order.addRider({ from: accts[req.body.user] });
          return _result;
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

router.get('/getOrders', async function (req, res, next) {
  var order = await Order.deployed();
  accts = await web3.eth.getAccounts();
  var orderItem, holder;
  try {
    await order.getOwnOrders.call({ from: accts[req.body.user] })
      .then(result => {
        holder = [];
        result.forEach(elem =>{
          orderItem = {};
          orderItem.orderId = elem.orderId;
          orderItem.customer = elem.customer;
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

module.exports = router;
