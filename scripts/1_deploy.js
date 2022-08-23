const { ethers } = require("hardhat");

async function main() {
    const accounts = await ethers.getSigners();

    // Fetch Contracts
    const fetchedToken = await ethers.getContractFactory("Token");
    const fetchedExchange = await ethers.getContractFactory("Exchange");

    // Deploy Contracts
    const deployedToken = await fetchedToken.deploy("UZAIR", "UZR", 18, 1000000);
    await deployedToken.deployed();
    
    const deployedExchange = await fetchedExchange.deploy(accounts[1].address, 10);
    await deployedExchange.deployed();

    const deployedmDAI = await fetchedToken.deploy('mDAI', 'mDAI', 18, 1000000);
    await deployedmDAI.deployed();
    
    const deployedmETH = await fetchedToken.deploy('mETH', 'mETH', 18, 1000000);
    await deployedmETH.deployed();
    
    console.log(`Token address: ${ deployedToken.address }`);
    console.log(`Exchange address: ${ deployedExchange.address }`);
    console.log(`mDAI address: ${ deployedmDAI.address }`);
    console.log(`mETH address: ${ deployedmETH.address }`);
}

main().catch( (err) => {
    console.error(`AN ERROR OCCURED: ${ err }`);
    process.exit(1);
});
