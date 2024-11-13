// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./Token.sol";

contract Exchange {
    // [] Set the fee account

    address public feeAccount; // 2nd account at Ganache. The account that receive exchange fees
    uint public feePercent; //  the fee as parcent
    mapping(address => mapping(address => uint256)) public tokens;

    event Deposit(address token, address user, uint256 amount, uint256 balance);

    constructor(address _feeAccount, uint _feeParcent) {
        feeAccount = _feeAccount;
        feePercent = _feeParcent;
    }
    // [] Deposit ether
    // [] Withdraw ether
    // [] Deposit tokens
    // send token to this contract
    // manage deposit - update balance
    // emit event
    function depositToken(address _token, uint _amount) public {
        // TODO: Don't allow ether deposit
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));
        tokens[_token][msg.sender] += _amount;
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    // [] Withdraw tokens
    // [] Check balances
    // [] Make order
    // [] Cancel order
    // [] Fill order
    // [] Change fees
}
