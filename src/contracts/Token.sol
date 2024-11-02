// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Token {
    string public name = "Tej Token";
    string public symbol = "Tejgaon College";
    uint256 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf; // ✋ Here balanceOf means who contains how much tokens. 

    constructor ()  {
        totalSupply = 1000000 * (10 ** decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer (address _to, uint256 _number_of_token) public returns (bool success){  // 🔴 _value

    // balanceOf[msg.sender] = balanceOf[msg.sender].sub(_number_of_token);
    // balanceOf[_to] = balanceOf[_to].add(_number_of_token);

    // Better way is here: 

    require(balanceOf[msg.sender] >= _number_of_token, "Insufficient balance");
        
        // Using `-` and `+` directly for subtraction and addition
        balanceOf[msg.sender] -= _number_of_token;
        balanceOf[_to] += _number_of_token;
    
       return true;
    }

}