// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Token {
    string public name;
    string public symbol;
    uint256 public decimals; // 18, because we are representing everything here in Wei (1 Ether = 10^9 GWei = 10^18 Wei)
    uint256 public totalSupply; // A million Ethers. We will represented them in Wei.
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(
        address indexed from,
        address indexed to, 
        uint256 value
    );
    
    event Approval(
        address indexed owner, 
        address indexed spender, 
        uint256 value
    );

    constructor(string memory _name, string memory _symbol, uint256 _decimals, uint256 _totalSupply) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply;

        /*
            Give all the tokens to the deployer of the smart contract.
            Here, msg is a global variable.
            msg.sender refers to the deployer's wallet address.
        */

        balanceOf[msg.sender] = totalSupply;
    }

    /*
        The function transferHelper( ... ) is not an explicit
        requirement of ERC-20. It is for refactoring purposes.
        It makes transfer( ... ) and transferFrom( ... ) cleaner
        by preventing code duplication. 
    */
    
    function transferHelper(address _from, address _to, uint256 _value) 
        internal 
    {
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(_from, _to, _value);
    }

    function transfer(address _to, uint256 _value)
        public 
        returns (bool success)
    {

        require(balanceOf[msg.sender] >= _value);
        require(_to != address(0));

        transferHelper(msg.sender, _to, _value);

        return true;
    }

    function approve(address _spender, uint256 _value)
        public 
        returns (bool success) 
    {
        require(_spender != address(0));

        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value)
        public 
        returns (bool success)
    {
        require(balanceOf[_from] >= _value, "insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "insufficient allowance");

        transferHelper(_from, _to, _value);
        allowance[_from][msg.sender] -= _value;

        return true;
    }
}
