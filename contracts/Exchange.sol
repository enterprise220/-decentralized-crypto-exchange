// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8;
import "./Token.sol";

contract Exchange {
    address public feeAccount;
    uint256 public feePercent;
    uint256 public orderNumber;
    
    /*
        The mapping down below keeps track of which smart contract's
        which user has submitted how much of their tokens to the
        exchange.
    */
    
    mapping(address => mapping(address => uint256)) public balanceOf;
    mapping(uint256 => _Order) public orders;

    struct _Order {
        uint256 id;
        address user;
        address tokenGive;
        uint256 amountGive;
        address tokenGet;
        uint256 amountGet;
        uint256 timestamp;
    }
    
    event Deposit(
        address smartContract,
        address user,
        uint256 amount,
        uint256 balance 
    );
    
    event Withdraw(
        address smartContract,
        address user,
        uint256 amount,
        uint256 balance 
    );
    
    event Order(
        uint256 id,
        address user,
        address tokenGive,
        uint256 amountGive,
        address tokenGet,
        uint256 amountGet,
        uint256 timestamp
    );
    
    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
        orderNumber = 0;
    }

    /*
        The function deposit( ... ) allows a user to list
        their crypto on the exchange.
    */
    
    function deposit(address _externalSmartContract, uint256 _deposittedAmount)
        public
    {
        /*
            The deposit( ... ) function will be called by the person
            who wants to deposit their token to the exchange. They 
            add the address of their contract in the "address _externalSmartContract"
            field. So, we will know who wants to transfer their CC
            to the exchange.

            1. msg.sender is the person who invokes the deposit( ... )
            function with thier address. We need to transfer CC from
            their contract to this exchange. So, the "from" parameter
            of the transferFrom( ... ) becomes msg.sender.

            2. msg.sender wants to transfer their crypto to the 
            exchange. So, the address of this smart contract is the 
            "to" field of the transferFrom( ... ) function.

            3. Finally, the amount is the token that msg.sender is
            transferring.
        */
        
        Token(_externalSmartContract).transferFrom(msg.sender, address(this), _deposittedAmount);
        balanceOf[_externalSmartContract][msg.sender] += _deposittedAmount;
        emit Deposit(_externalSmartContract, msg.sender,_deposittedAmount, balanceOf[_externalSmartContract][msg.sender]);
    }

    /*
        The function withdraw( ... ) allows a user to take their 
        listed crypto out of the exchange, as they no longer want
        to trade on this exchange.

        Why?

        Well, maybe they found another exchange with better rates
        for trading.
    */

    function withdraw(address _externalSmartContract, uint256 _withdrawalAmount)
        public
    {
        require(
            balanceOf[_externalSmartContract][msg.sender] >= _withdrawalAmount, 
            "ERROR: You have depositted NO crypto funds to the exchange yet. Therefore, your request for a withdrawal has been rejected."
        );
        
        Token(_externalSmartContract).transfer(msg.sender, _withdrawalAmount);
        balanceOf[_externalSmartContract][msg.sender] -= _withdrawalAmount;
        emit Withdraw(_externalSmartContract, msg.sender, _withdrawalAmount, balanceOf[_externalSmartContract][msg.sender]);
    }
    
    /*
        Making order means asking one of the users to put their
        crypto up for trade at a specific rate.

        _amountGive and _amoungGet give us the rate at which the 
        maker of the trade is trying to cut a deal.
    */
    
    function makeOrder(address _tokenGive, uint256 _amountGive, address _tokenGet, uint256 _amountGet)
        public
    {
        require(
            balanceOf[_tokenGive][msg.sender] >= _amountGive,
            "ERROR: Depositted funds are insufficient for this trade to take place."
        );
        
        orders[orderNumber] = _Order(
            orderNumber,
            msg.sender, 
            _tokenGive,
            _amountGive,
            _tokenGet,
            _amountGet,
            block.timestamp
        );

        emit Order(
            orderNumber++,
            msg.sender, 
            _tokenGive,
            _amountGive,
            _tokenGet,
            _amountGet,
            block.timestamp
        );
    }
}
