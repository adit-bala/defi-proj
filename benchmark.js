// benchmark.js
const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
const web3 = new Web3(provider);

// Load contract addresses
const contractAddresses = require('./contractAddress');

// Load TestZK ABI and instantiate
const testZKJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'build/contracts/TestZK.json')));
const testZK = new web3.eth.Contract(testZKJSON.abi, contractAddresses.TestZK);

// Load AxiomVerifier ABI and instantiate
const verifierJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'build/contracts/AxiomVerifier.json')));
const verifier = new web3.eth.Contract(verifierJSON.abi, contractAddresses.AxiomVerifier);

// Load sample proofs
const sampleProofs = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'proofs.json'))); // Ensure proofs.json exists and is properly formatted

async function benchmark() {
  const accounts = await web3.eth.getAccounts();
  const fromAccount = accounts[0];

  console.log("Starting Benchmark...");

  for (let i = 0; i < sampleProofs.length; i++) {
    const proof = sampleProofs[i].proof;
    const publicSignals = sampleProofs[i].publicSignals;

    // Format proof as required by the verifier
    const formattedProof = {
      a: [proof.a[0], proof.a[1]],
      b: [
        [proof.b[0][0], proof.b[0][1]],
        [proof.b[1][0], proof.b[1][1]]
      ],
      c: [proof.c[0], proof.c[1]]
    };

    // Public inputs
    const inputs = publicSignals;

    // Measure verification time
    const startTime = Date.now();
    try {
      const isValid = await verifier.methods.verifyProof(
        formattedProof.a,
        formattedProof.b,
        formattedProof.c,
        inputs
      ).call({ from: fromAccount });
      const endTime = Date.now();
      const timeTaken = endTime - startTime;

      console.log(`Proof ${i + 1} Verification - Valid: ${isValid}, Time Taken: ${timeTaken} ms`);
    } catch (error) {
      console.error(`Error verifying proof ${i + 1}:`, error);
    }
  }

  // Existing TestZK benchmarking (optional)
  const complexities = [10, 100, 1000, 10000];

  for (let complexity of complexities) {
    // Prepare data for computation
    const input = complexity;

    // Measure computation time for simpleComputation
    const startTimeSimple = Date.now();
    const resultSimple = await testZK.methods.simpleComputation().call({ from: fromAccount });
    const endTimeSimple = Date.now();
    const timeTakenSimple = endTimeSimple - startTimeSimple;

    console.log(`TestZK - Simple Computation - Result: ${resultSimple}, Time Taken: ${timeTakenSimple} ms`);

    // Estimate gas for complexComputation
    const gasEstimate = await testZK.methods.complexComputation(input).estimateGas({ from: fromAccount });

    // Measure gas cost and computation time for complexComputation
    const startTimeComplex = Date.now();
    const receiptComplex = await testZK.methods.complexComputation(input).send({ from: fromAccount, gas: gasEstimate });
    const endTimeComplex = Date.now();
    const gasUsedComplex = receiptComplex.gasUsed;
    const timeTakenComplex = endTimeComplex - startTimeComplex;

    console.log(`TestZK - Complex Computation - Complexity: ${complexity}, Gas Used: ${gasUsedComplex}, Time Taken: ${timeTakenComplex} ms`);
  }
}

benchmark().catch(error => {
  console.error(error);
  process.exit(1);
});
