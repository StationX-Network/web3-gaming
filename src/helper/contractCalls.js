import { Interface } from "ethers";
import Web3 from "web3";
// import { nftMarketPlaceAbi } from "../abi/nftMarketplace";
import { DAO_ADDRESS, NFT_RENT } from "./constants";
import { daoContractAbi } from "../abi/daoContract";
import { erc721DaoAbi } from "../abi/erc721Dao";

export const lendNft = async ({ token_address, token_id, price, time }) => {
  //   const ifaceNft = new Interface(nftMarketPlaceAbi);

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

  //   const dataNft = ifaceNft.encodeFunctionData("lend", [
  //     ["0"],
  //     [token_address],
  //     [token_id],
  //     ["1"],
  //     [1],
  //     ["0x00000001"],
  //     [3],
  //     [false]
  //   ]);

  //   const response = await daoContract.methods
  //     .updateProposalAndExecution(NFT_RENT, dataNft)
  //     .send({ from: window.ethereum.selectedAddress });

  //   console.log(response);
};

export const transferOwnership = async () => {
  const web3 = new Web3(window.ethereum);

  const nftDaoContract = new web3.eth.Contract(erc721DaoAbi, DAO_ADDRESS);

  const responseApproval = await nftDaoContract.methods
    .transferOwnership("0x5aC09Ca0865B5492a82460acb43ce658Ea6163D2")
    .send({ from: window.ethereum.selectedAddress });

  console.log(responseApproval);
};
