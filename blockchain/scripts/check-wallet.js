
const { ethers } = require("hardhat");

async function main() {
  const network = await ethers.provider.getNetwork();
  const [wallet] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(wallet.address);

  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId.toString());
  console.log("Wallet:", wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "POL");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});