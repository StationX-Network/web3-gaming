import { Interface } from "ethers";
import Web3 from "web3";
import { nftMarketPlaceAbi } from "../abi/nftMarketplace";
import { CLAIM_FACTORY, DAO_ADDRESS, NFT_RENT } from "./constants";
import { daoContractAbi } from "../abi/daoContract";
import { claimFactoryAbi } from "../abi/claimFactoryContract";

export const lendNft = async ({ token_address, token_id, price, time }) => {
  try {
    const ifaceNft = new Interface(nftMarketPlaceAbi);

    const approveIface = new Interface([
      "function setApprovalForAll(address operator, bool approved)"
    ]);

    const aproveData = approveIface.encodeFunctionData("setApprovalForAll", [
      NFT_RENT,
      token_id
    ]);

    const web3 = new Web3(window.ethereum);

    const daoContract = new web3.eth.Contract(daoContractAbi, DAO_ADDRESS);

    const responseApproval = await daoContract.methods
      .updateProposalAndExecution(token_address, aproveData)
      .send({ from: window.ethereum.selectedAddress });

    console.log(responseApproval);

    const dataNft = ifaceNft.encodeFunctionData("lend", [
      ["0"],
      [token_address],
      [token_id],
      ["1"],
      [1],
      ["0x00000001"],
      [3],
      [false]
    ]);

    const response = await daoContract.methods
      .updateProposalAndExecution(NFT_RENT, dataNft)
      .send({ from: window.ethereum.selectedAddress });

    console.log(response);
  } catch (e) {
    console.log(e);
  }
};

export const deployClaimContract = async (amount, description) => {
  const claimSettings = { amount: amount * 10 ** 6, description };
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

  return response;
};
