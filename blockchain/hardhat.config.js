require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const privateKey = process.env.POLYGON_PRIVATE_KEY;
const networks = {
  hardhat: {},
};

if (process.env.POLYGON_RPC_URL) {
  networks.polygonAmoy = {
    url: process.env.POLYGON_RPC_URL,
    chainId: 80002,
    accounts: privateKey ? [privateKey] : [],
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
};
