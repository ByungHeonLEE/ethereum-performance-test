import { ethers, upgrades } from "hardhat";

async function main() {
    const [signer] = await ethers.getSigners();
    console.log("Using account:", signer.address);

    const JH = await ethers.getContractFactory("Jeongho", signer);
    const jh = await upgrades.deployProxy(JH, ["0x5EbF87B6b6869FCf2422dE9D433E9737d7F2eC95"], {});
    await jh.waitForDeployment();
    console.log("JH deployed to:", await jh.getAddress());
}

main().catch((error) => {
    console.error("Error during deployment:", error);
    process.exitCode = 1;
});