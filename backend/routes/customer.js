var express = require('express');
var router = express.Router();
var Contract = require('web3-eth-contract');
Contract.setProvider('ws://localhost:7545');
var orderJson = require("../../truffle_project/build/contracts/Order.json")
var order = new Contract(orderJson)

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  // req.body.accountAddress
  // req.body.deliveryAddress
  res.send('respond with a resource');
});

module.exports = router;
