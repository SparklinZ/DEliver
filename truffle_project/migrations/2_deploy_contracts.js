const Order = artifacts.require("Order");
const ERC20 = artifacts.require("ERC20");

module.exports = async function (deployer, network, accounts) {
	deployer.then(async () => {
		await deployer.deploy(ERC20);
		await deployer.deploy(Order, ERC20.address);
	});
}
