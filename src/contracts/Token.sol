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

    function _transfer(address _from, address _to, uint256 _value) internal {
        require(_to != address(0));
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(_from, _to, _value);
    }

    function transfer(
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);
        _transfer(msg.sender, _to, _value);
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
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(balanceOf[_from] >= _value);
        require(
            allowance[_from][msg.sender] >= _value,
            "Insufficient allowance"
        );
        allowance[_from][msg.sender] -= _value; // Here: _form is the deployer, _to is the receiver and msg.sender is the spender. Spender sends tokens from the deployer to the receiver as it got approval from the deployer. (approve function).
        _transfer(_from, _to, _value);
        return true;
    }
}
