const UUNFT = artifacts.require("UUNFT");

module.exports = function (deployer) {
  deployer.deploy(UUNFT);
};
