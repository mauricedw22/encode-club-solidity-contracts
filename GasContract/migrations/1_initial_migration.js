const Migrations = artifacts.require("Migrations");
const GasContract = artifacts.require('GasContract');

module.exports = async function (deployer, network,accounts) {
 let admins = [accounts[0],accounts[1],accounts[2],accounts[3],accounts[4]]
 console.log(admins);
  deployer.deploy(Migrations);
 await deployer.deploy(GasContract,admins);
};

