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

router.get('/register', async function(req, res, next) {
  var order = await Order.deployed();
  accts = await web3.eth.getAccounts();
  // req.body.accountAddress
  // req.body.deliveryAddress
  result = await order.addCustomer.call('abcdefg', {from: accts[1]})
  if(result == accts[1]){
    await order.addCustomer('abcdefg', {from: accts[1]})
  }
  res.send(result);
});

module.exports = router;
