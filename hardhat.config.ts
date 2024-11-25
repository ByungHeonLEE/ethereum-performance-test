import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    hardhat: {},
    somnia: {
      url: "https://dream-rpc.somnia.network/",
      chainId: 50311,
      accounts: [
        process.env.PK1 || "",
        process.env.PK2 || "",
      ],
    },
  },
};

export default config;
