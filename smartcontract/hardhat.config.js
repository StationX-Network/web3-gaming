require("@nomiclabs/hardhat-ethers");
require("hardhat-abi-exporter");
require("@nomiclabs/hardhat-etherscan");
require("@nomicfoundation/hardhat-toolbox");
require("solidity-coverage");
require("hardhat-contract-sizer");

//Require .env
require("dotenv").config({ path: __dirname + "/.env" });

module.exports = {
  defaultNetwork: process.env.NETWORK,
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  networks: {
    polygon: {
      url: process.env.POLYGON_URL,
      accounts: [process.env.ACCOUNT_PRIVATE_KEY],
    },
    hardhat: {
      mining: {
        auto: true,
        interval: [3000, 6000],
      },
    },
  },
  solidity: {
    version: "0.8.16",
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 20000,
  },
  abiExporter: [
    {
      path: "./abi/json",
      runOnCompile: true,
      clear: true,
      flat: true,
      only: [
        "contracts/ClaimFactory.sol:ClaimFactory",
        "contracts/Claim.sol:Claim",
        "contracts/emitter.sol:ClaimEmitter",
      ],
      spacing: 2,
      format: "json",
    },
    {
      path: "./abi/minimal",
      runOnCompile: true,
      clear: true,
      flat: true,
      only: [
        "contracts/implementation.sol:ERC20NonTransferable",
        "contracts/factory.sol:FactoryCloneContract",
        "contracts/emitter.sol:Emitter",
        "contracts/proxy.sol:ProxyContract",
      ],
      spacing: 2,
      format: "minimal",
    },
  ],
  plugins: ["solidity-coverage"],
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: false,
    strict: true,
    only: [],
  },
  mocha: {
    timeout: 1000000000,
  },
};
