const { ethers } = require("hardhat");

async function main() {
  if (!process.env.POLYGON_PRIVATE_KEY) {
    throw new Error("Refusing deployment: POLYGON_PRIVATE_KEY must be configured.");
  }

  const network = await ethers.provider.getNetwork();
  if (network.chainId !== 80002n) {
    throw new Error(`Refusing deployment: expected Polygon Amoy (80002), got ${network.chainId}`);
  }

  const TraceabilityRegistry = await ethers.getContractFactory("TraceabilityRegistry");
  const contract = await TraceabilityRegistry.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`TraceabilityRegistry deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
