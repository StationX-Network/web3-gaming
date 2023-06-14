import { Web3OnboardProvider } from "@web3-onboard/react";
import { SUBGRAPH_CLIENT, web3Onboard } from "./helper/onboarding";
import { useEffect, useState } from "react";
import { fetchNfts } from "./helper/data";
import CollectionCard from "./components/CollectionCard";
import { DAO_ADDRESS } from "./helper/constants";
import { ApolloProvider } from "@apollo/client";
import "./App.css";

function App() {
  const [nftsData, setNftsData] = useState([]);

  useEffect(() => {
    const getNftData = async () => {
      const data = await fetchNfts(DAO_ADDRESS);
      setNftsData(data);
    };

    getNftData();
  }, []);

  return (
    <ApolloProvider client={SUBGRAPH_CLIENT}>
      <Web3OnboardProvider web3Onboard={web3Onboard}>
        <div className='App'>
          <div style={{ display: "flex", marginTop: "72px" }}>
            {nftsData &&
              nftsData.map((data, key) => (
                <CollectionCard
                  key={key}
                  metadata={data.metadata}
                  tokenName={data.name}
                  tokenSymbol={data.symbol}
                  nftData={data}
                />
              ))}
          </div>
        </div>
      </Web3OnboardProvider>
    </ApolloProvider>
  );
}

export default App;
