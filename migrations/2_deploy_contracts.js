const TestZK = artifacts.require("TestZK");
const fs = require('fs');
const path = require('path');

module.exports = async function (deployer) {
  await deployer.deploy(TestZK);
  const addressData = `module.exports = { contractAddress: '${TestZK.address}' };`;
  fs.writeFileSync(
    path.join(__dirname, '..', 'contractAddress.js'),
    addressData
  );
  console.log(`Contract deployed at: ${TestZK.address}`);
};