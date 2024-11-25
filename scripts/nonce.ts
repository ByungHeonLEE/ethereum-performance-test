import { ethers } from "hardhat";

async function main() {
  const provider = ethers.provider;
  const accounts = await ethers.getSigners();

  if (accounts.length < 2) {
    console.error("At least 2 accounts are required.");
    return;
  }

  console.log("Accounts loaded:");
  accounts.forEach((acc, idx) => console.log(`Account ${idx}: ${acc.address}`));

  const TEST_COUNT = 100;

  // Scenario 1: eth_transfer_to_random
  async function ethTransferToRandom() {
    console.log(`\nExecuting eth_transfer_to_random (${TEST_COUNT} transactions)...`);

    for (let i = 0; i < TEST_COUNT; i++) {
      const sender = accounts[i % accounts.length];
      const randomRecipient =
        accounts[Math.floor(Math.random() * accounts.length)];

      try {
        const tx = await sender.sendTransaction({
          to: randomRecipient.address,
          value: ethers.parseEther("0.0001"),
        });
        console.log(
          `Transaction ${i} sent: ${tx.hash} | From: ${sender.address} -> To: ${randomRecipient.address}`
        );
        await tx.wait();
      } catch (error) {
        console.error(`Error in transaction ${i}:`, error);
        break;
      }
    }
  }

  // Scenario 2: eth_transfer_to_self
  async function ethTransferToSelf() {
    console.log(`\nExecuting eth_transfer_to_self (${TEST_COUNT} transactions)...`);

    for (let i = 0; i < TEST_COUNT; i++) {
      const sender = accounts[i % accounts.length];

      try {
        const tx = await sender.sendTransaction({
          to: sender.address,
          value: ethers.parseEther("0.0001"),
        });
        console.log(
          `Transaction ${i} sent: ${tx.hash} | Self-transfer by: ${sender.address}`
        );
        await tx.wait();
      } catch (error) {
        console.error(`Error in transaction ${i}:`, error);
        break;
      }
    }
  }

  // Run scenarios
  console.log("\nStarting stress test...");
  await ethTransferToRandom();
  await ethTransferToSelf();
  console.log("\nStress test completed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
