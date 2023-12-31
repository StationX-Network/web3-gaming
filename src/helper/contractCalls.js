import { ethers, Interface } from "ethers";
import Web3 from "web3";
import { nftMarketPlaceAbi } from "../abi/nftMarketplace";
import {
  CLAIM_ADDRESS,
  CLAIM_FACTORY,
  DAO_ADDRESS,
  NFT_RENT,
  USDC
} from "./constants";
import { daoContractAbi } from "../abi/daoContract";
import { claimFactoryAbi } from "../abi/claimFactoryContract";
import { erc20ABI } from "../abi/erc20";
import { claimContractAbi } from "../abi/claimContract";

export const lendNft = async ({ token_address, token_id, price, time }) => {
  try {
    const ifaceNft = new Interface(nftMarketPlaceAbi);

    // const approveIface = new Interface([
    //   "function setApprovalForAll(address operator, bool approved)"
    // ]);

    // const aproveData = approveIface.encodeFunctionData("setApprovalForAll", [
    //   NFT_RENT,
    //   token_id
    // ]);

    const web3 = new Web3(window.ethereum);

    const daoContract = new web3.eth.Contract(daoContractAbi, DAO_ADDRESS);

    // const responseApproval = await daoContract.methods
    //   .updateProposalAndExecution(token_address, aproveData)
    //   .send({ from: window.ethereum.selectedAddress });

    // console.log(responseApproval);

    const dataNft = ifaceNft.encodeFunctionData("lend", [
      ["0"],
      [token_address],
      [token_id],
      ["1"],
      [time],
      ["0x00000100"],
      [3],
      [false]
    ]);

    await daoContract.methods
      .updateProposalAndExecution(NFT_RENT, dataNft)
      .send({ from: window.ethereum.selectedAddress });
  } catch (e) {
    console.log(e);
  }
};

export const rentNft = async (token_address, token_id, time, lending_id) => {
  try {
    const web3 = new Web3(window.ethereum);

    // const usdcContract = new web3.eth.Contract(erc20ABI, USDC);

    // const responseApproval = await usdcContract.methods
    //   .approve(NFT_RENT, ethers.parseUnits("10", 6).toString())
    //   .send({ from: window.ethereum.selectedAddress });

    // console.log(responseApproval);

    const nftRentContract = new web3.eth.Contract(nftMarketPlaceAbi, NFT_RENT);

    const dataNft = [
      [0],
      [token_address],
      [token_id],
      [lending_id],
      [Number(time)],
      [1]
    ];

    await nftRentContract.methods
      .rent(...dataNft)
      .send({ from: window.ethereum.selectedAddress });
  } catch (e) {
    console.log(e);
  }
};

export const deployClaimContract = async (amount, description) => {
  const claimSettings = [
    window.ethereum.selectedAddress, // creator address
    window.ethereum.selectedAddress, // eoa address
    USDC, // usdc address
    "0x0000000000000000000000000000000000000000", // token gating address
    true, // has allowance - wallet , if false -> contract
    false, // isNft
    0, // nfttotal supply
    true, // isClaimable
    (Date.now() / 1000).toFixed(0), // start Date
    1689396196, // end date
    window.ethereum.selectedAddress, // rollback address
    "0x0000000000000000000000000000000000000000000000000000000000000001", // merkle root
    3,
    [
      true, // if false -> prorata else => custom amount
      ethers.parseUnits("0.01", 6).toString(),
      ethers.parseUnits(amount, 6).toString(), // total no. of tokens
      []
    ],
    [false, 0]
  ];

  // const claimSettings = { amount: amount * 10 ** 6, description };
  const web3 = new Web3(window.ethereum);

  const claimFactoryContractSend = new web3.eth.Contract(
    claimFactoryAbi,
    CLAIM_FACTORY
  );

  const response = await claimFactoryContractSend?.methods
    ?.deployClaimContract(claimSettings)
    .send({
      from: window.ethereum.selectedAddress
    });

  const newClaimContract = response.logs[0].address;

  const erc20TokenContractSend = new web3.eth.Contract(erc20ABI, USDC);
  await erc20TokenContractSend.methods
    ?.approve(newClaimContract, ethers.parseUnits(amount, 6).toString())
    .send({
      from: window.ethereum.selectedAddress
    });

  return response;
};

export const claim = async () => {
  const web3 = new Web3(window.ethereum);

  const claimContractSend = new web3.eth.Contract(
    claimContractAbi,
    CLAIM_ADDRESS
  );

  const amount = ethers.parseUnits("0.01", 6).toString();

  await claimContractSend.methods?.claim(amount, [], []).send({
    from: window.ethereum.selectedAddress
  });
};
