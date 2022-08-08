const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token", () => {
    let fetchedToken;
    let deployedToken;
    
    beforeEach(async () => { // this function runs before each "it( ... )"
        fetchedToken = await ethers.getContractFactory("Token");
        deployedToken = await fetchedToken.deploy();
    });
    
    it(`has correct name`, async () => {
        expect(await deployedToken.name()).to.equal("ZarCoin");
    });

    it(`has correct symbol`, async () => {
        expect(await deployedToken.symbol()).to.equal("ZRC");
    });
});
