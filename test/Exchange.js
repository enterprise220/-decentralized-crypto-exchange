const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Exchange", () => {
    let fetchedExchange, deployedExchange;
    let allAccounts, deployer, feeAccount;
    
    beforeEach(async() => {
        allAccounts = await ethers.getSigners();
        deployer = allAccounts[0];
        feeAccount = allAccounts[1];

        fetchedExchange = await ethers.getContractFactory("Exchange");
        deployedExchange = await fetchedExchange.deploy(feeAccount.address, 1);
    });
    
    it("adds correct account as the feeAccount", async() => {
        expect(await deployedExchange.feeAccount()).to.equal(feeAccount.address);
    });
    
    it("sets the correct value for feePercent", async() => {
        expect(await deployedExchange.feePercent()).to.equal(1);
    });
});
