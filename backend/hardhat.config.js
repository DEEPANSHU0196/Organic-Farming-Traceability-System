require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
const path = require("path");

const networks = {
  hardhat: {},
};

if (process.env.POLYGON_RPC_URL) {
  networks.polygonAmoy = {
    url: process.env.POLYGON_RPC_URL,
    chainId: 80002,
    accounts: process.env.POLYGON_PRIVATE_KEY ? [process.env.POLYGON_PRIVATE_KEY] : [],
  };
}

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
  networks,
  paths: {
    root: path.resolve(__dirname, "../blockchain"),
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
