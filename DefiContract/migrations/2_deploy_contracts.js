const DeFiContract = artifacts.require('DeFi');
module.exports = async function (deployer) {
 await deployer.deploy(DeFiContract);
};