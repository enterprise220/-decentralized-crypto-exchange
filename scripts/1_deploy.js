const { ethers } = require("hardhat");

async function main() {
    const obtainedToken = await ethers.getContractFactory("Token");
    const deployedToken = await obtainedToken.deploy();
    
    console.log(`Token deployed to the following address: ${ deployedToken.address }`);
}

main()
.catch( (err) => {
    console.error(`We encountered an error during deployment: ${ err }`);
    process.exit(1);
});
