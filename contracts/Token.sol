// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Token {
    string public name;
    string public symbol;
    uint256 public decimals; // 18, because we are representing everything here in Wei (1 Ether = 10^9 GWei = 10^18 Wei)
    uint256 public totalSupply; // A million Ethers. We will represented them in Wei.
    mapping(address => uint256) public balanceOf;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _decimals,
        uint256 _totalSupply
    ) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _totalSupply;

        /*
            Give all the tokens to the deployer of the smart contract.
            Here, msg is a global variable.
            msg.sender refers to the deployer's wallet address
        */

        balanceOf[msg.sender] = totalSupply;
    }
}
