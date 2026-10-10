const { ethers } = require("hardhat");

async function main() {
  const network = await ethers.provider.getNetwork();
  if (network.chainId !== 80002n) {
    throw new Error(`Refusing deployment: expected Polygon Amoy (80002), got ${network.chainId}`);
  }

  const registryFactory = await ethers.getContractFactory("TraceabilityRegistry");
  const registry = await registryFactory.deploy();
  await registry.waitForDeployment();

  console.log(`TraceabilityRegistry deployed to: ${await registry.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});