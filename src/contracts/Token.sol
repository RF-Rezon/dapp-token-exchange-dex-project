// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Token {
    string public name = "Tej Token";
    string public symbol = "Tejgaon College";
    uint256 public decimals = 18;
    uint256 public totalSupply;

    constructor ()  {
        totalSupply = 1000000 * (10 ** decimals);
    }


}