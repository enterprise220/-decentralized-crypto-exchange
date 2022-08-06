require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // This allows us to read our environment variables inside our HardHat project

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    localhost: {
        url: "http://127.0.0.1:8545"
    },
  }
};
