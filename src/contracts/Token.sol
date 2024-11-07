// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Token {
    // Value
    string public name = "Tej Token";
    string public symbol = "Tejgaon College";
    uint256 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf; // ✋ Here balanceOf means who contains how much tokens.
    mapping(address => mapping(address => uint256)) public allowance;

    // Events

    event Transfer(address indexed from, address indexed _to, uint256 _value);
    event Approval(
        address indexed owner,
        address indexed _spender,
        uint256 _value
    );

    constructor() {
        totalSupply = 1000000 * (10 ** decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(_to != address(0));
        require(balanceOf[msg.sender] >= _value);

        // Using `-` and `+` directly for subtraction and addition
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(
        address _spender,
        uint256 _value
    ) public returns (bool success) {
        require(_spender != address(0));
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
}
