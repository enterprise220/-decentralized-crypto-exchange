const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TOKEN", () => {
    let fetchedToken, deployedToken, transaction, result;
    let allAccounts, deployer, receiver, exchange;

    function ethersToWei(n) {
        return(ethers.utils.parseUnits(n.toString(), "ether")); // Return equivalent Wei for inputted Ethers.
    }
    
    beforeEach(async () => { // This hook runs before each "it( ... )"
        fetchedToken = await ethers.getContractFactory("Token");
        deployedToken = await fetchedToken.deploy("Uzair", "UZR", 18, ethersToWei(1000000)); // ^ Supplying params to the constructor of the contract during its deployment.
        allAccounts = await ethers.getSigners(); // Get all 20 accounts.
        deployer = allAccounts[0]; // The first (out of the 20 given) account is that of the deployer's.
        receiver = allAccounts[1]; // Let us pretend the second address to be our receiver.
        exchange = allAccounts[2]; // Predending the third address to be that of the exchange's.
    });
    
    describe("Deployment", () => {
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
            expect(await deployedToken.balanceOf(deployer.address)).to.equal(totalSupply);
        });
    });

    describe("Token Transfer", () => {
        describe("Success", () => {
            beforeEach(async() => {
                transaction = await deployedToken.transfer(receiver.address, ethersToWei(100));
                result = await transaction.wait();
            });
    
            it("implements transfer ( ... ) correctly", async() => {            
                expect(await deployedToken.balanceOf(deployer.address)).to.equal(ethersToWei(1000000 - 100));
                expect(await deployedToken.balanceOf(receiver.address)).to.equal(ethersToWei(100));
            });
    
            it(`emits the "Transfer" event with correct details`, async() => {
                const emittedEvent = result.events[0];
    
                expect(emittedEvent.event).to.equal("Transfer");
                expect(emittedEvent.args.from).to.equal(deployer.address);
                expect(emittedEvent.args.to).to.equal(receiver.address);
                expect(emittedEvent.args.value).to.equal(ethersToWei(100));
            });
        });

        describe("Failure", () => {
            it('rejects transfer of insufficient funds', async() => {
                await expect(deployedToken.transfer(receiver.address, ethersToWei(1000000000))).to.be.reverted;
            });
            
            it("rejects invalid recepient", async() => {
                await expect(deployedToken.approve("0x0000000000000000000000000000000000000000", ethersToWei(1000000000))).to.be.reverted;
            });
        });
    });

    describe("Token Approvals", () => {
        beforeEach(async() => {
            transaction = await deployedToken.approve(exchange.address, ethersToWei(100));
            result = await transaction.wait();
        });
        
        describe("Success", () => {
            it("allocates an allowance to the spender", async() => {
                expect(await deployedToken.allowance(deployer.address, exchange.address)).to.equal(ethersToWei(100));
            });
            
            it(`emits the "Approval" event with correct details`, async() => {
                const emittedEvent = result.events[0];
    
                expect(emittedEvent.event).to.equal("Approval");
                expect(emittedEvent.args.owner).to.equal(deployer.address);
                expect(emittedEvent.args.spender).to.equal(exchange.address);
                expect(emittedEvent.args.value).to.equal(ethersToWei(100));
            });
        });

        describe("Failure", () => {
            it("rejects invalid spender", async() => {
                await expect(deployedToken.approve("0x0000000000000000000000000000000000000000", ethersToWei(1000000000))).to.be.reverted;
            });
        });
    });

    describe("3rd Party Token Transfers", () => {
        beforeEach(async() => {
            transaction = await deployedToken.approve(exchange.address, ethersToWei(100));
            result = await transaction.wait();
        });
        
        describe("Success", () => {
            beforeEach(async() => {
                /*
                    Below, we are connecting with the exchange.
                    Here, we ask the exchange to call transferFrom( ... ).
                    And then transfer funds to the receiver.

                    Usually, we use only deployedToken.function( ... ), but here, 
                    we are using deployedToken.connect( ... ).

                    connect( ... ) allows the exchange to call the transferFrom function.
                */
                
                transaction = await deployedToken.connect(exchange).transferFrom(deployer.address, receiver.address, ethersToWei(100));
                result = await transaction.wait();
            });
            
            it("transfers funds correctly on some 3rd party's behalf", async() => {
                expect(await deployedToken.balanceOf(deployer.address)).to.equal(ethersToWei(1000000 - 100));
                expect(await deployedToken.balanceOf(receiver.address)).to.equal(ethersToWei(100));
            });
            
            it("updates allowance of 3rd parties", async() => {
                expect(await deployedToken.allowance(deployer.address, exchange.address)).to.equal(ethersToWei(0));
            });

            it(`emits the "Transfer" event with correct details for 3rd party transfers`, async() => {
                const emittedEvent = result.events[0];
    
                expect(emittedEvent.event).to.equal("Transfer");
                expect(emittedEvent.args.from).to.equal(deployer.address);
                expect(emittedEvent.args.to).to.equal(receiver.address);
                expect(emittedEvent.args.value).to.equal(ethersToWei(100));
            });
        });
        
        describe("Failure", () => {
            it("rejects insufficient allowance transfer request from 3rd parties", async() => {
                await expect(deployedToken.connect(exchange).transferFrom(deployer.address, receiver.address, ethersToWei(1000))).to.be.reverted;
            });
            
            it("rejects insufficient funds transfer request from 3rd parties", async() => {
                await expect(deployedToken.connect(exchange).transferFrom(deployer.address, receiver.address, ethersToWei(100000000000))).to.be.reverted;
            });
        });
    });
});
