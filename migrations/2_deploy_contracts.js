var Organisations = artifacts.require("./Organisations.sol");
var AcademicRecords = artifacts.require("./AcademicRecords.sol");
var HelloWorld = artifacts.require("./HelloWorld.sol");

module.exports = function(deployer) {
  deployer.deploy(Organisations);
  deployer.deploy(AcademicRecords);
  deployer.deploy(HelloWorld);
};
