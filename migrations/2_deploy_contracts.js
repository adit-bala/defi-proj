// migrations/2_deploy_contracts.js
const TestZK = artifacts.require("TestZK");
const AxiomVerifier = artifacts.require("AxiomVerifier");
const fs = require('fs');
const path = require('path');

module.exports = async function (deployer) {
  // Deploy TestZK
  await deployer.deploy(TestZK);
  const testZKAddress = TestZK.address;

  // Deploy AxiomVerifier
  await deployer.deploy(AxiomVerifier);
  const verifierAddress = AxiomVerifier.address;

  // Write contract addresses to contractAddress.js
  const addressData = `
    module.exports = {
      TestZK: '${testZKAddress}',
      AxiomVerifier: '${verifierAddress}'
    };
  `;
  fs.writeFileSync(
    path.join(__dirname, '..', 'contractAddress.js'),
    addressData
  );

  console.log(`Contracts deployed:
    - TestZK at ${testZKAddress}
    - AxiomVerifier at ${verifierAddress}
  `);
};
