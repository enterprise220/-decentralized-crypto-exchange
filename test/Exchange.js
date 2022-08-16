const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Exchange", () => {
    let fetchedExchange, deployedExchange, fetchedToken, deployedToken;
    let allAccounts, deployer, feeAccount, user1, user2;
    let transaction, result;

    function ethersToWei(n) {
        return ethers.utils.parseUnits(n.toString(), "ether");
    }

    beforeEach(async() => {
        allAccounts = await ethers.getSigners();
        deployer = allAccounts[0]; // 0th account is the deployer by default
        feeAccount = allAccounts[1];
        user1 = allAccounts[2];
        user2 = allAccounts[3];

        fetchedExchange = await ethers.getContractFactory("Exchange");
        deployedExchange = await fetchedExchange.deploy(feeAccount.address, 1);

        fetchedToken = await ethers.getContractFactory("Token");
        deployedToken = await fetchedToken.deploy("Uzair", "UZR", 18, ethersToWei(1000000));

        /*
            Below, we are allowing the deployer of Token to create
            a new user (user1) inside the Token smart contract by
            giving them some balance and adding them to the balanceOf
            mapping by calling transfer( ... ) function

            Every transaction that happens for token deposits will be
            carried out by user1, not the deployer.
        */
        
        transaction = await deployedToken.connect(deployer).transfer(user1.address, ethersToWei(100));
        result = await transaction.wait();
    });
    
    it("adds correct account as the feeAccount", async() => {
        expect(await deployedExchange.feeAccount()).to.equal(feeAccount.address);
    });
    
    it("sets the correct value for feePercent", async() => {
        expect(await deployedExchange.feePercent()).to.equal(1);
    });

    describe("Token Deposits", () => {
        beforeEach(async() => {
            transaction = await deployedToken.connect(user1).approve(deployedExchange.address, ethersToWei(100));
            result = await transaction.wait();

            transaction = await deployedExchange.connect(user1).deposit(deployedToken.address, ethersToWei(100));
            result = await transaction.wait();
        });

        describe("Success", () => {
            it("it tracks token deposits correctly", async() => {
                expect(await deployedToken.balanceOf(deployedExchange.address)).to.equal(ethersToWei(100));
                expect(await deployedToken.balanceOf(user1.address)).to.equal(ethersToWei(0));
            });
        });
    });
});
