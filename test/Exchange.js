const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Exchange", () => {
    let fetchedExchange, deployedExchange, fetchedToken, deployedToken1, deployedToken2;
    let allAccounts, deployer, user1, user2;
    let transaction, result;

    function toWei(n) {
        return ethers.utils.parseUnits(n.toString(), "ether");
    }

    beforeEach(async() => {
        allAccounts = await ethers.getSigners();
        
        /*
            0th account is that of the deployer's by default.
            They are also called the "feeAccount."
            They charge fee for every transaction that happens on this exchange.
        */
        
        deployer = allAccounts[0]; // 0th account is the deployer by default.
        user1 = allAccounts[1];
        user2 = allAccounts[2];

        fetchedExchange = await ethers.getContractFactory("Exchange");
        deployedExchange = await fetchedExchange.deploy(deployer.address, 10);

        fetchedToken = await ethers.getContractFactory("Token");
        deployedToken1 = await fetchedToken.deploy("Uzair", "UZR", 18, toWei(1000000));
        deployedToken2 = await fetchedToken.deploy("Mock DAI", "mDAI", 18, toWei(1000000));

        /*
            Below, we are allowing the deployer of Token to create
            a new user (user1) inside the Token smart contract by
            giving them some balance and adding them to the balanceOf
            mapping by calling transfer( ... ) function

            Every transaction that happens for token deposits will be
            carried out by user1, not the deployer.
        */
        
        await deployedToken1.connect(deployer).transfer(user1.address, toWei(100));
    });
    
    it("adds correct account as the deployer", async() => {
        expect(await deployedExchange.feeAccount()).to.equal(deployer.address);
    });
    
    it("sets the correct value for feePercent", async() => {
        expect(await deployedExchange.feePercent()).to.equal(10);
    });

    describe("Token Deposits", () => {
        describe("Success", () => {
            beforeEach(async() => {
                await deployedToken1.connect(user1).approve(deployedExchange.address, toWei(100));
                transaction = await deployedExchange.connect(user1).deposit(deployedToken1.address, toWei(100));
                result = await transaction.wait();
            });

            it("tracks token deposits correctly", async() => {
                expect(await deployedToken1.balanceOf(user1.address)).to.equal(toWei(0));
                expect(await deployedToken1.balanceOf(deployedExchange.address)).to.equal(toWei(100));
                expect(await deployedExchange.balanceOf(deployedToken1.address, user1.address)).to.equal(toWei(100));
            });
            
            it(`emits the "Deposit" event correctly`, async() => {
                expect(result.events[1].args.smartContract).to.equal(deployedToken1.address);
                expect(result.events[1].args.user).to.equal(user1.address);
                expect(result.events[1].args.amount).to.equal(toWei(100));
                expect(result.events[1].args.balance).to.equal(toWei(100));
                expect(result.events[1].event).to.equal("Deposit");
            });
        });

        describe("Failure", () => {
            it("fails if there is no approval for token deplosit", async() => {
                await expect(deployedExchange.connect(user1).deposit(deployedToken1.address, toWei(100))).to.be.reverted;
            });
        });
    });
    
    describe("Token Withdrawal", () => {
        describe("Success", () => {
            beforeEach(async() => {
                await deployedToken1.connect(user1).approve(deployedExchange.address, toWei(100));
                await deployedExchange.connect(user1).deposit(deployedToken1.address, toWei(100));
            });

            it("tracks token withdrawal correctly", async() => {
                transaction = await deployedExchange.connect(user1).withdraw(deployedToken1.address, toWei(100));
                result = await transaction.wait();
                
                expect(await deployedToken1.balanceOf(user1.address)).to.equal(toWei(100));
                expect(await deployedToken1.balanceOf(deployedExchange.address)).to.equal(toWei(0));
                expect(await deployedExchange.balanceOf(deployedToken1.address, user1.address)).to.equal(toWei(0));
            });
            
            it(`emits the "Withdrawal" event correctly`, async() => {
                // expect(result.events[1].args.smartContract).to.equal(deployedToken1.address);
                expect(result.events[1].args.user).to.equal(user1.address);
                expect(result.events[1].args.amount).to.equal(toWei(100));
                expect(result.events[1].args.balance).to.equal(toWei(0));
                expect(result.events[1].event).to.equal("Withdraw");
            });
        });

        describe("Failure", () => {
            it("fails to withdraw without a deposit first", async() => {
                await expect(deployedExchange.connect(user1).withdraw(deployedToken1.address, toWei(100))).to.be.reverted;
            });
        });
    });
    
    
    describe("Making Orders", () => {
        describe("Success", () => {
            beforeEach(async() => {
                await deployedToken1.connect(user1).approve(deployedExchange.address, toWei(100));
                await deployedExchange.connect(user1).deposit(deployedToken1.address, toWei(100));
            
                transaction = await deployedExchange.connect(user1).make(deployedToken1.address, toWei(1), deployedToken2.address, toWei(1));
                result = await transaction.wait();
            });

            it("makes orders correctly", async() => {
                expect(await deployedExchange.orderNumber()).to.equal(1);
            });
            
            it(`emits the "Make Order" event correctly`, async() => {
                expect(result.events[0].event).to.equal("Make");
                expect(result.events[0].args.id).to.equal(0);
                expect(result.events[0].args.user).to.equal(user1.address);
                expect(result.events[0].args.amountGive).to.equal(toWei(1));
                expect(result.events[0].args.amountGet).to.equal(toWei(1));
                expect(result.events[0].args.tokenGet).to.equal(deployedToken2.address);
                expect(result.events[0].args.tokenGive).to.equal(deployedToken1.address);
                expect(result.events[0].args.timestamp).to.at.least(1);
            });
        });

        describe("Failure", () => {
            it("fails to make orders with insufficient funds", async() => {
                await deployedToken1.connect(user1).approve(deployedExchange.address, toWei(10));
                await deployedExchange.connect(user1).deposit(deployedToken1.address, toWei(10));
                await expect(deployedExchange.connect(user1).make(deployedToken1.address, toWei(100), deployedToken2.address, toWei(1))).to.be.reverted;
            });
        });
    });
    
    describe("Cancelling Orders", () => {
        describe("Success", () => {
            beforeEach(async() => {
                await deployedToken1.connect(user1).approve(deployedExchange.address, toWei(100));
                await deployedExchange.connect(user1).deposit(deployedToken1.address, toWei(100));
                await deployedExchange.connect(user1).make(deployedToken1.address, toWei(1), deployedToken2.address, toWei(1));
                transaction = await deployedExchange.connect(user1).cancel(0);
                result = await transaction.wait();
            });

            it("cancels orders correctly", async() => {
                expect(await deployedExchange.cancelledOrders(0)).to.equal(true);
            });
            
            it(`emits the "Cancel Order" event correctly`, async() => {
                expect(result.events[0].event).to.equal("Cancel");
                expect(result.events[0].args.id).to.equal(0);
                expect(result.events[0].args.user).to.equal(user1.address);
                expect(result.events[0].args.amountGive).to.equal(toWei(1));
                expect(result.events[0].args.amountGet).to.equal(toWei(1));
                expect(result.events[0].args.tokenGet).to.equal(deployedToken2.address);
                expect(result.events[0].args.tokenGive).to.equal(deployedToken1.address);
                expect(result.events[0].args.timestamp).to.at.least(1);
            });
        });

        describe("Failure", () => {
            beforeEach(async() => {
                await deployedToken1.connect(user1).approve(deployedExchange.address, toWei(100));
                await deployedExchange.connect(user1).deposit(deployedToken1.address, toWei(100));
            });
            
            it("prevents cancellation of the order before making it", async() => {
                await expect(deployedExchange.connect(user1).cancel(99)).to.be.reverted;
            });
            
            it("prevents cancellation of somebody's order by other users", async() => {
                await deployedExchange.connect(user1).make(deployedToken1.address, toWei(1), deployedToken2.address, toWei(1));
                await expect(deployedExchange.connect(user2).cancel(0)).to.be.reverted;
            });
        });
    });

    describe("Fill Orders", () => {
        describe("Success", () => {
            beforeEach(async() => {
                await deployedToken1.connect(deployer).transfer(user1.address, toWei(1));
                await deployedToken1.connect(user1).approve(deployedExchange.address, toWei(1));
                await deployedExchange.connect(user1).deposit(deployedToken1.address, toWei(1));
                await deployedExchange.connect(user1).make(deployedToken1.address, toWei(1), deployedToken2.address, toWei(1));
                
                await deployedToken2.connect(deployer).transfer(user2.address, toWei(2));
                await deployedToken2.connect(user2).approve(deployedExchange.address, toWei(2));
                await deployedExchange.connect(user2).deposit(deployedToken2.address, toWei(2));
                transaction = await deployedExchange.connect(user2).fill(0);
                result = await transaction.wait();
            });
            
            it("makes trades correctly", async() => {
                expect(await deployedExchange.balanceOf(deployedToken2.address, deployer.address)).to.equal(toWei(0.1)); // deployer fee
                
                expect(await deployedExchange.balanceOf(deployedToken1.address, user1.address)).to.equal(toWei(0)); // token1 taken from user1
                expect(await deployedExchange.balanceOf(deployedToken2.address, user2.address)).to.equal(toWei(0.9)); // token2 taken from user2
                
                expect(await deployedExchange.balanceOf(deployedToken1.address, user2.address)).to.equal(toWei(1)); // token1 given to user2
                expect(await deployedExchange.balanceOf(deployedToken2.address, user1.address)).to.equal(toWei(1)); // token2 given to user1
            });
            
            it("adds filled trades to the relevant mapping", async() => {
                expect(await deployedExchange.filledOrders(0)).to.equal(true);

            });

            it(`emits the "Fill Order" event correctly`, async() => {
                expect(result.events[0].event).to.equal("Trade");
                expect(result.events[0].args.id).to.equal(0);
                expect(result.events[0].args.maker).to.equal(user1.address);
                expect(result.events[0].args.filler).to.equal(user2.address);
                expect(result.events[0].args.amountGive).to.equal(toWei(1));
                expect(result.events[0].args.amountGet).to.equal(toWei(1));
                expect(result.events[0].args.tokenGet).to.equal(deployedToken2.address);
                expect(result.events[0].args.tokenGive).to.equal(deployedToken1.address);
                expect(result.events[0].args.timestamp).to.at.least(1);
            });
        });

        describe("Failure", () => {
            it("does not allow filling non-existing orders", async() => {
                await expect(deployedExchange.connect(user2).fill(99999999)).to.be.reverted;
            });
            
            it("does not allow insufficient funds transfer", async() => {
                await deployedToken1.connect(deployer).transfer(user1.address, toWei(10));
                await deployedToken1.connect(user1).approve(deployedExchange.address, toWei(10));
                await deployedExchange.connect(user1).deposit(deployedToken1.address, toWei(10));
                await deployedExchange.connect(user1).make(deployedToken1.address, toWei(10), deployedToken2.address, toWei(10));
                
                await deployedToken2.connect(deployer).transfer(user2.address, toWei(1));
                await deployedToken2.connect(user2).approve(deployedExchange.address, toWei(1));
                await deployedExchange.connect(user2).deposit(deployedToken2.address, toWei(1));
                
                await expect(deployedExchange.connect(user2).fill(0)).to.be.reverted;
            });
            
            it("does not allow filling cancelled orders", async() => {
                await deployedToken1.connect(deployer).transfer(user1.address, toWei(1));
                await deployedToken1.connect(user1).approve(deployedExchange.address, toWei(1));
                await deployedExchange.connect(user1).deposit(deployedToken1.address, toWei(1));
                await deployedExchange.connect(user1).make(deployedToken1.address, toWei(1), deployedToken2.address, toWei(1));
                await deployedExchange.connect(user1).cancel(0);
                
                await deployedToken2.connect(deployer).transfer(user2.address, toWei(2));
                await deployedToken2.connect(user2).approve(deployedExchange.address, toWei(2));
                await deployedExchange.connect(user2).deposit(deployedToken2.address, toWei(2));
                
                await expect(deployedExchange.connect(user2).fill(0)).to.be.reverted;
            });
            
            it("does not allow re-filling the order", async() => {
                await deployedToken1.connect(deployer).transfer(user1.address, toWei(1));
                await deployedToken1.connect(user1).approve(deployedExchange.address, toWei(1));
                await deployedExchange.connect(user1).deposit(deployedToken1.address, toWei(1));
                await deployedExchange.connect(user1).make(deployedToken1.address, toWei(1), deployedToken2.address, toWei(1));

                await deployedToken2.connect(deployer).transfer(user2.address, toWei(2));
                await deployedToken2.connect(user2).approve(deployedExchange.address, toWei(2));
                await deployedExchange.connect(user2).deposit(deployedToken2.address, toWei(2));
                await deployedExchange.connect(user2).fill(0);
                
                await expect(deployedExchange.connect(user2).fill(0)).to.be.reverted;
            });
        });
    });
});
