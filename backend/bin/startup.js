var truffleContract = require('truffle-contract')
var Web3 = require('web3')
var web3 = new Web3('ws://localhost:8545')
var orderJson = require("../../truffle_project/build/contracts/Order.json")
var Order = truffleContract(orderJson)
Order.setProvider(web3.currentProvider)

module.exports = async()=>{
    var order = await Order.deployed();
    accts = await web3.eth.getAccounts();
    await order.addCustomer('JE ST11 BLK 111 #11-11', { from: accts[0] });
    await order.addCustomer('JE ST11 BLK 111 #11-12', { from: accts[1] });
    await order.addCustomer('JE ST11 BLK 111 #11-13', { from: accts[2] });
    await order.addCustomer('JE ST11 BLK 111 #11-14', { from: accts[3] });
    await order.addCustomer('JE ST11 BLK 111 #11-15', { from: accts[4] });
    await order.addCustomer('JE ST11 BLK 111 #11-16', { from: accts[5] });
    await order.addRider({ from: accts[6] });
    await order.addRider({ from: accts[7] });
    await order.addRider({ from: accts[8] });
    await order.addRider({ from: accts[9] });
}