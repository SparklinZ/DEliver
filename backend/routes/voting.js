var express = require('express');
var router = express.Router();
var truffleContract = require('truffle-contract')
var Web3 = require('web3')
var web3 = new Web3('ws://localhost:8545')
var orderJson = require("../../truffle_project/build/contracts/Order.json")
var Order = truffleContract(orderJson)
Order.setProvider(web3.currentProvider)

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//fileComplaint
router.post('/complain', async function (req, res, next) {
  var order = await Order.deployed();
  accts = await web3.eth.getAccounts();
  try {
    await order.fileComplaint.call(req.body.complaint, req.body.orderId, { from: accts[req.body.user] })
      .then(_result => {
        order.fileComplaint(req.body.complaint, req.body.orderId, { from: accts[req.body.user] })
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

//req.body user 1-10
router.post('/getConflict', async function (req, res, next) {
  var order = await Order.deployed();
  accts = await web3.eth.getAccounts();
  try {
    await order.getConflicts.call({ from: accts[req.body.user] })
      .then(result => {
        //find the array of indexes that have the least votes
        let result3 = result[3].map(function (x) {
          return parseInt(x, 10);
        });
        const min = result3.reduce((acc, val) => Math.min(acc, val), Infinity);
        const res = [];
        for (let i = 0; i < result3.length; i++) {
          if (result3[i] !== min) {
            continue;
          };
          res.push(i);
        };

        //among those with the least votes get one conflict
        var rand = Math.floor(Math.random() * (res.length));
        rand = res[rand]
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

router.post('/vote', async function (req, res, next) {
  var order = await Order.deployed();
  accts = await web3.eth.getAccounts();
  try {
    await order.voteConflict.call(req.body.vote, req.body.orderId, { from: accts[req.body.user] })
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
