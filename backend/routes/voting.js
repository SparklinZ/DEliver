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
router.get('/getConflict', async function (req, res, next) {
  var order = await Order.deployed();
  accts = await web3.eth.getAccounts();
  try {
    await order.getConflicts.call({ from: accts[req.body.user] })
      .then(result => {
        var rand = Math.floor(Math.random() * (result[0].length));
        conflict = {};
        conflict.orderId = result[0][rand].orderId;
        conflict.restaurant = result[0][rand].restaurant;
        conflict.deliveryFee = result[0][rand].deliveryFee;
        conflict.itemNames = result[0][rand].itemNames;
        conflict.itemQuantities = result[0][rand].itemQuantities;
        conflict.orderTime = result[0][rand].orderTime;
        conflict.customerComplaint = result[1][rand];
        conflict.riderComplaint = result[2][rand];
        return conflict;
    }).then(result => {
      res.status(200);
      res.send(result);
    })
  } catch (err) {
    res.status(500)
    res.render('error', { error: err })
  }
});

router.get('/vote', async function (req, res, next) {
  var order = await Order.deployed();
  accts = await web3.eth.getAccounts();
  try {
    await order.voteConflict.call(req.body.orderId, req.body.vote, { from: accts[req.body.user] })
      .then(_result => {
        order.voteConflict(req.body.vote, req.body.orderId, { from: accts[req.body.user] })
        return _result;
    }).then(result => {
      res.status(200);
      res.send(result);
    })
  } catch (err) {
    res.status(500)
    res.render('error', { error: err })
  }
});

module.exports = router;
