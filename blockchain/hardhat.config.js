require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const privateKey = process.env.POLYGON_PRIVATE_KEY;

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
    polygonAmoy: {
      url: process.env.POLYGON_RPC_URL || "https://rpc-amoy.polygon.technology/",
      chainId: 80002,
      accounts: privateKey ? [privateKey] : [],
    },
  },
};