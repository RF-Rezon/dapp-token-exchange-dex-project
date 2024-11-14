// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./Token.sol";

contract Exchange {
    // [] Set the fee account

    address public feeAccount; // 2nd account at Ganache. The account that receive exchange fees
    uint public feePercent; //  the fee as parcent
    address constant ETHER = address(0); // store Ether in tokens mapping with black addresses. 2 works in one go.
    mapping(address => mapping(address => uint256)) public tokens;

    event Deposit(address token, address user, uint256 amount, uint256 balance);

    constructor(address _feeAccount, uint _feeParcent) {
        feeAccount = _feeAccount;
        feePercent = _feeParcent;
    }

    // fallback() external {
    //     revert();
    // }
    receive() external payable {
        revert();
    }
    // [] Deposit ether
    function depositEther() public payable {
        tokens[ETHER][msg.sender] += msg.value;
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }
    // [] Withdraw ether

    // [] Deposit tokens
    function depositToken(address _token, uint _amount) public {
        require(_token != ETHER);
        require(Token(_token).transferFrom(msg.sender, address(this), _amount)); // send token to this contract
        tokens[_token][msg.sender] += _amount; // manage deposit - update balance
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]); // emit event
    }

    // [] Withdraw tokens
    // [] Check balances
    // [] Make order
    // [] Cancel order
    // [] Fill order
    // [] Change fees
}
