const Order = artifacts.require("Order");

module.exports = async function (deployer, network, accounts) {
	deployer.then(async () => {
		await deployer.deploy(Order);
	});
}
