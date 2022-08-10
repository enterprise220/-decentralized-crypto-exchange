const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TOKEN", () => {
    let fetchedToken, deployedToken, allAccounts, deployersAddress;

    function ethersToWei(n) {
        // Returns equivalent Wei for inputted Ethers.

        return(ethers.utils.parseUnits(n.toString(), "ether")); 
    }
    
    beforeEach(async () => { // This hook runs before each "it( ... )"
        fetchedToken = await ethers.getContractFactory("Token");
        deployedToken = await fetchedToken.deploy("Uzair", "UZR", 18, ethersToWei(1000000));
        // ^ Supplying params to the constructor of the contract during its deployment.
        allAccounts = await ethers.getSigners();
        deployersAddress = allAccounts[0].address; // The first (out of the 20 given) accounts is the deployer.
    });
    
    describe("01. Deployment:", () => {
        const name = "Uzair";
        const symbol = "UZR";
        const decimals = "18";
        const totalSupply = ethersToWei(1000000);
        
        it(`has correct name`, async () => {
            expect(await deployedToken.name()).to.equal(name);
        });
    
        it(`has correct symbol`, async () => {
            expect(await deployedToken.symbol()).to.equal(symbol);
        });
    
        it('has correct decimals', async () => {
            expect(await deployedToken.decimals()).to.equal(decimals);
        });
    
        it('has correct total supply', async () => {
            expect(await deployedToken.totalSupply()).to.equal(totalSupply); // Equal to this many Wei: "1000000000000000000000000"
        });

        it('has assigned total supply to the deployer', async() => {
            expect(await deployedToken.balanceOf(deployersAddress)).to.equal(totalSupply);
        });
    });
});
