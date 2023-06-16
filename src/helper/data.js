import axios from "axios";
import { DAO_ADDRESS } from "./constants";
import { Alchemy, Network } from "alchemy-sdk";
import { QUERY_ALL_LENDS, QUERY_ALL_RENTS } from "./queries";

const MAIN_API_URL = "https://api.stationx.network/v1/";

const SUBGRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/subham7/stnx-web3-gaming1";

const settings = {
  apiKey: "kT3AsZH1GwL8xiWrDOA0kaV7lGUx6f6i", // Replace with your Alchemy API Key
  network: Network.MATIC_MAINNET // Replace with your desired network
};

export const fetchNfts = async (daoAddress) => {
  try {
    const networkId = "0x89";
    const nftsData = await axios.get(
      MAIN_API_URL + `assets/dao/${daoAddress}/nft?networkId=${networkId}`
    );
    return nftsData.data;
  } catch (error) {
    console.log(error);
  }
};

export const rentedNfts = [
  {
    tokenName: "Galaxy Token 2",
    imgUrl:
      "https://ipfs.io/ipfs/Qmf4GUi4TQN8LP1JwWWuLyubtbUvf5zBaRL695DemTonpG/6079.png",
    price: "0.1",
    days: "5"
  },
  {
    tokenName: "Galaxy Token 234",
    imgUrl:
      "https://ipfs.io/ipfs/QmTZtxRccEB6hcCGeGsr5d3Xd1aNk9DGdjR2fdiA3DNjet",
    price: "0.4",
    days: "2"
  }
];

export const nftsForRent = [
  {
    tokenName: "Galaxy Token 12",
    imgUrl:
      "https://ipfs.io/ipfs/Qmf4GUi4TQN8LP1JwWWuLyubtbUvf5zBaRL695DemTonpG/6079.png",
    price: "1",
    days: "180"
  },
  {
    tokenName: "Galaxy Token 34",
    imgUrl:
      "https://ipfs.io/ipfs/QmTZtxRccEB6hcCGeGsr5d3Xd1aNk9DGdjR2fdiA3DNjet",
    price: "0.01",
    days: "31"
  },
  {
    tokenName: "Galaxy Token 3094",
    imgUrl:
      "https://ipfs.io/ipfs/QmTZtxRccEB6hcCGeGsr5d3Xd1aNk9DGdjR2fdiA3DNjet",
    price: "0.05",
    days: "21"
  }
];

export const fetchLends = async () => {
  try {
    const { lends } = await subgraphQuery(
      SUBGRAPH_URL,
      QUERY_ALL_LENDS(DAO_ADDRESS)
    );

    const alchemy = new Alchemy(settings);

    const newLendsData = [];
    for (const lend of lends) {
      const { nftAddress, tokenID } = lend;
      const metadata = await getNFTMetadata(alchemy, nftAddress, tokenID);
      newLendsData.push({ ...metadata, ...lend });
    }
    return newLendsData;
  } catch (error) {
    console.log(error);
  }
};

export const fetchRents = async () => {
  try {
    const { rents } = await subgraphQuery(SUBGRAPH_URL, QUERY_ALL_RENTS());

    return rents;
  } catch (error) {
    console.log(error);
  }
};

export const subgraphQuery = async (SUBGRAPH_URL, query) => {
  try {
    const response = await axios.post(SUBGRAPH_URL, {
      query
    });
    if (response.data.errors) {
      console.error(response.data.errors);
      throw new Error(`Error making subgraph query ${response.data.errors}`);
    }
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};

export const getNFTMetadata = async (alchemy, nftAddress, tokenID) => {
  try {
    const response = await alchemy.nft.getNftMetadata(nftAddress, tokenID);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const mergeData = (assetData, lendsData, rentData) => {
  const dataMap = new Map();
  assetData.forEach((asset) => {
    const { token_address, token_id } = asset;
    const key = token_address + "-" + token_id;
    if (!dataMap.has(key)) {
      dataMap.set(key, asset);
    }
  });
  lendsData.forEach((asset) => {
    const { nftAddress, tokenID } = asset;
    const key = nftAddress + "-" + tokenID;
    if (!dataMap.has(key)) {
      const rented = rentData.filter(
        (data) => data.lendingID === asset.lendingID
      );
      if (rented) {
        dataMap.set(key, { ...asset, ...rented[0] });
      } else {
        dataMap.set(key, asset);
      }
    }
  });

  // const lendingIds = lendsData.map((data) => data.lendingID);

  // rentData.forEach((asset) => {
  //   const { lendingID } = asset;
  //   if (lendingIds.includes(lendingID)) {
  //     const key = nftAddress + "-" + tokenID;
  //     if (dataMap.has(key)) {
  //       dataMap.set(key, { ...dataMap.get(key), ...asset });
  //     }
  //   }
  // });

  // console.log(dataMap);

  return dataMap;
};
