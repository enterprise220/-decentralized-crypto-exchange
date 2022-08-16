// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8;
import "./Token.sol";

contract Exchange {
    address public feeAccount;
    uint256 public feePercent;
    
    /*
        The mapping down below keeps track of which smart contract's
        which user has submitted how much of their tokens to the
        exchange.
    */
    
    mapping(address => mapping(address => uint256)) public balanceOf;

    event Deposit(
        address smartContract,
        address user,
        uint256 amount,
        uint256 balance 
    );
    
    constructor(address _feeAccount, uint256 _feePercent) {
        feeAccount = _feeAccount;
        feePercent = _feePercent;
    }

    function deposit(address _externalSmartContract, uint256 _value)
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
        
        Token(_externalSmartContract).transferFrom(msg.sender, address(this), _value);
        balanceOf[_externalSmartContract][msg.sender] += _value;
        emit Deposit(_externalSmartContract, msg.sender,_value, balanceOf[_externalSmartContract][msg.sender]);
    }
}
