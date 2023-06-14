import axios from "axios";
import { DAO_ADDRESS } from "./constants";
const MAIN_API_URL = "https://api.stationx.network/v1/";

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

export const QUERY_NFT_DETAILS = () => {
  return `query{
              stations(where: {daoAddress: "${DAO_ADDRESS}"}) {
                id
                ownerAddress
                daoAddress
                gnosisAddress
                name
                tokenType
                symbol
                isGtTransferable
                imageUrl
                isGovernanceActive
              }
      }`;
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
