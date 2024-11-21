const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
const web3 = new Web3(provider);

const contractJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'build/contracts/TestZK.json')));
const contractABI = contractJSON.abi;
const { contractAddress } = require('./contractAddress');
const testZK = new web3.eth.Contract(contractABI, contractAddress);

async function benchmark() {
  const accounts = await web3.eth.getAccounts();
  const fromAccount = accounts[0];

  // Complexity levels
  const complexities = [10, 100, 1000, 10000];

  for (let complexity of complexities) {
    // Prepare data for computation
    const input = complexity;

    // Measure computation time for simpleComputation
    const startTimeSimple = Date.now();
    const resultSimple = await testZK.methods.simpleComputation().call({ from: fromAccount });
    const endTimeSimple = Date.now();
    const timeTakenSimple = endTimeSimple - startTimeSimple;

    console.log(`Simple Computation - Result: ${resultSimple}, Time Taken: ${timeTakenSimple} ms`);

    // Estimate gas for complexComputation
    const gasEstimate = await testZK.methods.complexComputation(input).estimateGas({ from: fromAccount });

    // Measure gas cost and computation time for complexComputation
    const startTimeComplex = Date.now();
    const receiptComplex = await testZK.methods.complexComputation(input).send({ from: fromAccount, gas: gasEstimate });
    const endTimeComplex = Date.now();
    const gasUsedComplex = receiptComplex.gasUsed;
    const timeTakenComplex = endTimeComplex - startTimeComplex;

    console.log(`Complex Computation - Complexity: ${complexity}, Gas Used: ${gasUsedComplex}, Time Taken: ${timeTakenComplex} ms`);
  }
}

benchmark().catch(error => {
  console.error(error);
  process.exit(1);
});