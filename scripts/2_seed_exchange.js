const { ethers } = require("hardhat");

async function main() {
    const UZR = await ethers.getContractAt("Token", "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9");
    const mDAI = await ethers.getContractAt("Token", "0x0165878A594ca255338adfa4d48449f69242Eb8F");
    const mETH = await ethers.getContractAt("Token", "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853");
}

main()
.catch((error) => {
    console.log("AN ERROR OCCURED:", error);
    process.exit(1);
});
