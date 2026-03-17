import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import fs from "fs";
import path from "path";

function loadEnvFile(): void {
  const envPath = path.resolve(__dirname, ".env");
  if (!fs.existsSync(envPath)) {
    return;
  }

  const contents = fs.readFileSync(envPath, "utf8");
  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function normalizePrivateKey(value: string): string {
  return value.startsWith("0x") ? value : `0x${value}`;
}

loadEnvFile();

const alchemyApiKey = process.env.ALCHEMY_API_KEY ?? "";
const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY ?? "";
const etherscanApiKey = process.env.ETHERSCAN_API_KEY ?? "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      evmVersion: "cancun",
    },
  },
  networks: {
    hardhat: {
      chainId: 1337 // Local hardhat network
    },
    sepolia: {
      url: alchemyApiKey
        ? `https://eth-sepolia.g.alchemy.com/v2/${alchemyApiKey}`
        : "https://eth-sepolia.g.alchemy.com/v2/MISSING_ALCHEMY_API_KEY",
      chainId: 11155111,
      accounts: deployerPrivateKey ? [normalizePrivateKey(deployerPrivateKey)] : [],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: etherscanApiKey || "MISSING_ETHERSCAN_API_KEY",
    },
  },
};

export default config;
