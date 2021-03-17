var express = require('express');
var router = express.Router();
var truffleContract = require('truffle-contract')
var Web3 = require('web3')
var web3 = new Web3('ws://localhost:7545')
var orderJson = require("../../truffle_project/build/contracts/Order.json")
var Order = truffleContract(orderJson)
Order.setProvider(web3.currentProvider)

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//req.body user 1-10
router.get('/addRider', async function (req, res, next) {
  var order = await Order.deployed();
  accts = await web3.eth.getAccounts();
  try {
    await order.addCustomer.call({ from: accts[req.body.user] })
      .then((_result) => {
        if (_result == accts[req.body.user]) {
          await order.addCustomer({ from: accts[req.body.user] })
          return result
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

module.exports = router;
