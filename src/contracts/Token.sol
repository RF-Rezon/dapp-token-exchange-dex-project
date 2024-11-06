// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Token {
    // Value
    string public name = "Tej Token";
    string public symbol = "Tejgaon College";
    uint256 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf; // ✋ Here balanceOf means who contains how much tokens. 

    // Events 

    event Transfer(address from, address _to, uint256 _ammouts_of_tokens);

    constructor ()  {
        totalSupply = 1000000 * (10 ** decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer (address _to, uint256 _ammouts_of_tokens) public returns (bool success){  // 🔴 _value

    // balanceOf[msg.sender] = balanceOf[msg.sender].sub(_ammouts_of_tokens);
    // balanceOf[_to] = balanceOf[_to].add(_ammouts_of_tokens);

    // Better way is here: 

       require(_to != address(0));
       require(balanceOf[msg.sender] >= _ammouts_of_tokens);
        
        // Using `-` and `+` directly for subtraction and addition
        balanceOf[msg.sender] -= _ammouts_of_tokens;
        balanceOf[_to] += _ammouts_of_tokens;
        emit Transfer(msg.sender, _to, _ammouts_of_tokens);
       return true;
    } 

}