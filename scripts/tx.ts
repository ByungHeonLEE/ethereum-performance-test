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

  const TEST_COUNT = 10;

  // Scenario 1: eth_transfer_to_random
  async function ethTransferToRandom() {
    console.log(`\nExecuting eth_transfer_to_random (${TEST_COUNT} transactions)...`);

    const promises = [];
    const nonceTracker: Record<string, number> = {};

    for (const account of accounts) {
      nonceTracker[account.address] = await provider.getTransactionCount(account.address, "latest");
    }

    for (let i = 0; i < TEST_COUNT; i++) {
      const sender = accounts[i % accounts.length];
      const randomRecipient =
        accounts[Math.floor(Math.random() * accounts.length)];
    
      const txPromise = sender.sendTransaction({
        to: randomRecipient.address,
        value: ethers.parseEther("0.0001"),
        nonce: nonceTracker[sender.address]++, // nonce를 증가시키면서 사용
      });
      promises.push(txPromise);

      console.log(
        `Scheduled transaction ${i}: From ${sender.address} -> To ${randomRecipient.address}`
      );
    }

    const txReceipts = await Promise.all(promises);
    txReceipts.forEach((tx, idx) =>
      console.log(`Transaction ${idx} mined | Tx: ${tx.hash}`)
    );
  }

  // Scenario 2: eth_transfer_to_self
  async function ethTransferToSelf() {
    console.log(`\nExecuting eth_transfer_to_self (${TEST_COUNT} transactions)...`);

    const promises = [];
    const nonceTracker: Record<string, number> = {};

    for (const account of accounts) {
      nonceTracker[account.address] = await provider.getTransactionCount(account.address, "latest");
    }

    for (let i = 0; i < TEST_COUNT; i++) {
      const sender = accounts[i % accounts.length];
    
      // 명시적으로 nonce를 설정하여 병렬 실행 시 충돌 방지
      const txPromise = sender.sendTransaction({
        to: sender.address,
        value: ethers.parseEther("0.0001"),
        nonce: nonceTracker[sender.address]++, // nonce를 증가시키면서 사용
      });
      promises.push(txPromise);

      console.log(
        `Scheduled self-transaction ${i}: From ${sender.address}`
      );
    }

    const txReceipts = await Promise.all(promises);
      txReceipts.forEach((tx, idx) =>
      console.log(`Transaction ${idx} mined | Tx: ${tx.hash}`)
    );
  }

  // Run scenarios
  console.log("\nStarting stress test...");
  await Promise.all([ethTransferToRandom()]);
  await Promise.all([ethTransferToSelf()]);
  console.log("\nStress test completed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
