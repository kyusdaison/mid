import { ethers } from "hardhat";

async function main() {
  console.log("Starting FCDIDRegistry deployment...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const FCDIDRegistry = await ethers.getContractFactory("FCDIDRegistry");
  // Hardhat's deploy mechanism
  const registry = await FCDIDRegistry.deploy(deployer.address);

  // Hardhat 2.x way of waiting for deployment
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log("FCDIDRegistry deployed to:", address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
