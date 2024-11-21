// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TestZK {
    uint256 public result;

    // Simple computation as a pure function
    function simpleComputation() public pure returns (uint256) {
        return 1 + 1;
    }

    // Complex computation that updates state
    function complexComputation(uint256 input) public returns (uint256) {
        uint256 temp = input;
        for (uint256 i = 0; i < input; i++) {
            temp = temp * input % 1000000007;
        }
        result = temp;
        return result;
    }
}