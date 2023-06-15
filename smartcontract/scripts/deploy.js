const hre = require("hardhat");
const { exec } = require("child_process");
// require("dotenv").config({ path: __dirname + "./../.env" });
var Web3 = require("web3");

var config = require("./../config/index");

async function main() {
  const NETWORK = config.NETWORK;

  // Deploying Claim Factory
  const Factory = await hre.ethers.getContractFactory("ClaimFactory");
  const factory_instance = await Factory.deploy();
  await factory_instance.deployed();
  console.log("Factory deployed to:", factory_instance.address);
  exec(
    `npx hardhat verify --network ${NETWORK} ${factory_instance.address}`,
    async (error, stdout, stderr) => {
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      console.log(error);
    }
  );

  //Deploying Emitter
  const Emitter = await hre.ethers.getContractFactory("ClaimEmitter");
  const emitter_instance = await Emitter.deploy(factory_instance.address);
  await emitter_instance.deployed();
  console.log("Emitter deployed to:", emitter_instance.address);
  exec(
    `npx hardhat verify --network ${NETWORK} ${emitter_instance.address} "${factory_instance.address}"`,
    async (error, stdout, stderr) => {
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      console.log(error);
    }
  );

  await factory_instance.setEmitter(emitter_instance.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
