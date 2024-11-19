// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./Token.sol";

contract Exchange {
    // [] Set the fee account

    address public feeAccount; // 2nd account at Ganache. The account that receive exchange fees
    uint public feePercent; //  the fee as parcent
    address constant ETHER = address(0); // store Ether in tokens mapping with black addresses. 2 works in one go.

    mapping(address => mapping(address => uint256)) public tokens;
    mapping(uint256 => _Order) public orders;
    mapping(uint256 => bool) public orderCancelled;
    mapping(uint256 => bool) public orderFilled;

    uint256 public orderCount;

    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event Withdraw(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );

    event Order(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );

    event Cancel(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 timestamp
    );

    event Trade(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        address userFill
    );

    struct _Order {
        uint256 id;
        address user;
        address tokenGet;
        uint256 amountGet;
        address tokenGive;
        uint256 amountGive;
        uint256 timestamp;
    }

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
    function withdrawEther(uint256 _amount) public {
        require(tokens[ETHER][msg.sender] >= _amount);
        tokens[ETHER][msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
        emit Withdraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
    }
    // [] Deposit tokens
    function depositToken(address _token, uint _amount) public {
        require(_token != ETHER);
        require(Token(_token).transferFrom(msg.sender, address(this), _amount)); // send token to this contract
        tokens[_token][msg.sender] += _amount; // manage deposit - update balance
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]); // emit event
    }

    // [] Withdraw tokens
    function withdrawToken(address _token, uint _amount) public {
        require(tokens[_token][msg.sender] >= _amount);
        require(Token(_token).transfer(msg.sender, _amount));
        tokens[_token][msg.sender] -= _amount;
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }
    // [] Check balances
    function balanceOf(
        address _token,
        address _user
    ) public view returns (uint256) {
        return tokens[_token][_user];
    }
    // [] Make order
    function makeOrder(
        address _tokenGet, // Token user want to purchase
        uint256 _amountGet, // The amouts of tokens user wanna get
        address _tokenGive,
        uint256 _amountGive
    ) public {
        orderCount++;
        orders[orderCount] = _Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );
        emit Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            block.timestamp
        );
    }
    // [] Cancel order
    function cancelOrder(uint256 _id) public {
        _Order storage _order = orders[_id];
        require(address(_order.user) == msg.sender);
        require(_order.id == _id); // The order must exist
        orderCancelled[_id] = true;

        emit Cancel(
            _order.id,
            _order.user,
            _order.tokenGet,
            _order.amountGet,
            _order.tokenGive,
            _order.amountGive,
            _order.timestamp
        );
    }
    // [] Fill order
    function fillOrder(uint256 _id) public {
        require(_id > 0 && _id <= orderCount);
        require(!orderFilled[_id]);
        require(!orderCancelled[_id]);
        _Order storage _order = orders[_id];
        _trade(
            _order.id,
            _order.user,
            _order.tokenGet,
            _order.amountGet,
            _order.tokenGive,
            _order.amountGive
        );
        orderFilled[_order.id] = true;
    }
    function _trade(
        uint256 _orderId,
        address _user,
        address _tokenGet, // Token being received
        uint256 _amountGet, // Amount being received
        address _tokenGive, // Token being given
        uint256 _amountGive // Amount being given
    ) internal {
        // Fee is paid by the user who fills the order
        // Fee deducted from _amountGive

        uint256 _initialFeeAmount = _amountGive * feePercent;
        uint256 _feeAmount = _initialFeeAmount / 100;
        uint256 totalAmmountNeedToDeduct = _amountGet + _feeAmount;

        // Execute trade >>>>>>>>>>>>>>>>>
        // Deduct tokens from user1 (msg.sender)
        tokens[_tokenGet][msg.sender] -= totalAmmountNeedToDeduct;
        // Credit tokens to user2 (_user)
        tokens[_tokenGet][_user] += _amountGet;

        // Charge fees  >>>>>>>>>>>>>>>>>>>>>>
        // Add the fee to the feeAccount
        tokens[_tokenGet][feeAccount] += _feeAmount;
        // Deduct tokens from user2 (_user)
        tokens[_tokenGive][_user] -= _amountGive;
        // Credit tokens to user1 (msg.sender)
        tokens[_tokenGive][msg.sender] += _amountGive;

        emit Trade(
            _orderId, // Add the trade ID
            _user, // The user making the trade
            _tokenGet, // Token being received
            _amountGet, // Amount being received
            _tokenGive, // Token being given
            _amountGive, // Amount being given
            msg.sender // User who filled the trade (this could be the msg.sender)
        );
    }
}
