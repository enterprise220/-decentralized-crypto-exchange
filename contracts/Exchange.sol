// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8;
import "./Token.sol";

contract Exchange {

    /*
        The deployer of this exchange takes some fee for every trade 
        that happens on this exchange. Hence, the deployer.address
        thing is the feeAccount
    */

    address public feeAccount;
    uint256 public feePercent;
    uint256 public orderNumber;
    
    /*
        The mapping down below keeps track of which smart contract's
        which user has submitted how much of their tokens to the
        exchange.
    */
    
    mapping(address => mapping(address => uint256)) public balanceOf;
    mapping(uint256 => Order) public orders;
    mapping(uint256 => bool) public cancelledOrders;
    mapping(uint256 => bool) public filledOrders;

    struct Order {
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
    
    event Make(
        uint256 id,
        address user,
        address tokenGive,
        uint256 amountGive,
        address tokenGet,
        uint256 amountGet,
        uint256 timestamp
    );
    
    event Cancel(
        uint256 id,
        address user,
        address tokenGive,
        uint256 amountGive,
        address tokenGet,
        uint256 amountGet,
        uint256 timestamp
    );

    event Trade(
        uint256 id,
        address maker,
        address filler,
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
        listed crypto out of the exchange before making any orders, 
        as they no longer want to trade on this exchange.

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
    
    function make(address _tokenGive, uint256 _amountGive, address _tokenGet, uint256 _amountGet)
        public
    {
        require(
            balanceOf[_tokenGive][msg.sender] >= _amountGive,
            "ERROR: Depositted funds are insufficient for this trade to take place."
        );
        
        orders[orderNumber] = Order(
            orderNumber,
            msg.sender, 
            _tokenGive,
            _amountGive,
            _tokenGet,
            _amountGet,
            block.timestamp
        );

        emit Make(
            orderNumber++,
            msg.sender, 
            _tokenGive,
            _amountGive,
            _tokenGet,
            _amountGet,
            block.timestamp
        );
    }

    function cancel(uint256 _orderID)
        public
    {
        Order storage fetchedOrder = orders[_orderID];
        
        require(
            fetchedOrder.id == _orderID,
            "ERROR: You cannot cancel an order before making it."
        );
        
        require(
            fetchedOrder.user == msg.sender,
            "ERROR: You can only cancel your own orders."
        );
        
        cancelledOrders[_orderID] = true;

        emit Cancel(
            _orderID,
            msg.sender,
            fetchedOrder.tokenGive,
            fetchedOrder.amountGive,
            fetchedOrder.tokenGet,
            fetchedOrder.amountGet,
            block.timestamp
        );
    }

    /*
        We assume that fill( ... ) is always called by user2.
        So, tokenGive in the actual order is tokenGet for user2.
        And tokenGet in the actuaal order is tokenGive for user2.
    */
    
    function fill(uint256 _orderID)
        public
    {
        Order storage fetchedOrder = orders[_orderID];
        uint256 feeAmount = (fetchedOrder.amountGet * feePercent) / 100;

        require(
            !cancelledOrders[_orderID],
            "ERROR: This order has been cancelled by the maker. Therefore, it cannot be filled out."
        );
        
        require(
            !filledOrders[_orderID],
            "ERROR: This order has been filled by some other user. Therefore, it cannot be filled out by you now."
        );
        
        require(
            _orderID >= 0 && _orderID < orderNumber,
            "ERROR: Not a valid order ID."
        );
        
        require(
            balanceOf[fetchedOrder.tokenGet][msg.sender] >= fetchedOrder.amountGet + feeAmount,
            "ERROR: You have to deposit sufficient funds to the exchange for this trade to happen."
        );
        
        executeTrade(_orderID, feeAmount);
    }
    
    function executeTrade(uint256 _orderID, uint256 _feeAmount)
        internal
    {
        Order storage fetchedOrder = orders[_orderID];
        
        // Swap part 01: user2 => user1
        
        balanceOf[fetchedOrder.tokenGet][msg.sender] -= (fetchedOrder.amountGet + _feeAmount);
        balanceOf[fetchedOrder.tokenGet][fetchedOrder.user] += fetchedOrder.amountGet;

        // Fee ... charged by the deployer ... from user2 ONLY
        
        balanceOf[fetchedOrder.tokenGet][feeAccount] += _feeAmount;
        
        // Swap part 02: user1 => user2
        
        balanceOf[fetchedOrder.tokenGive][fetchedOrder.user] -= fetchedOrder.amountGive;
        balanceOf[fetchedOrder.tokenGive][msg.sender] += fetchedOrder.amountGive; 

        emit Trade(
            _orderID,
            fetchedOrder.user,
            msg.sender,
            fetchedOrder.tokenGive,
            fetchedOrder.amountGive,
            fetchedOrder.tokenGet,
            fetchedOrder.amountGet,
            block.timestamp
        );

        filledOrders[_orderID] = true;
    }
}
