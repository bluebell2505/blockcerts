require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    sepolia: {
      url: process.env.ALCHEMY_URL, // Infura/Alchemy RPC
      accounts: [process.env.PRIVATE_KEY] // from .env
    }
  }
};
