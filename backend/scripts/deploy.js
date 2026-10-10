const { ethers } = require("hardhat");

async function main() {
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
