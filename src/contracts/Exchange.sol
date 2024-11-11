// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./Token.sol";

contract Exchange {
    // [] Set the fee account

    address public feeAccount; // 2nd account at Ganache. The account that receive exchange fees
    uint public feePercent; //  the fee as parcent

    constructor(address _feeAccount, uint _feeParcent) {
        feeAccount = _feeAccount;
        feePercent = _feeParcent;
    }
    // [] Deposit ether
    // [] Withdraw ether
    // [] Deposit tokens
    function depositToken(address _token, uint _amount) public {
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));
    }
    // [] Withdraw tokens
    // [] Check balances
    // [] Make order
    // [] Cancel order
    // [] Fill order
    // [] Change fees
}
