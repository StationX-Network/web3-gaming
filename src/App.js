import { Web3OnboardProvider } from "@web3-onboard/react";
import { SUBGRAPH_CLIENT, web3Onboard } from "./helper/onboarding";
import { useEffect, useState } from "react";
import { fetchNfts } from "./helper/data";
import CollectionCard from "./components/CollectionCard";
import { DAO_ADDRESS } from "./helper/constants";
import { ApolloProvider } from "@apollo/client";
import "./App.css";
import Sidebar from "./components/Sidebar";
import ClaimSetupCard from "./components/ClaimSetupCard";

function App() {
  const [nftsData, setNftsData] = useState([]);
  const [selected, setSelected] = useState("Lend");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (
      window.ethereum.selectedAddress?.toLowerCase() ===
      "0x5aC09Ca0865B5492a82460acb43ce658Ea6163D2".toLowerCase()
    ) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  }, [window.ethereum.selectedAddress]);

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
          <Sidebar
            isOwner={isOwner}
            onClickClaim={() => {
              setSelected("Claim");
            }}
            onClickLend={() => {
              setSelected("Lend");
            }}
          />
          <div className='listing-div'>
            {selected === "Claim" ? (
              <div>
                <h3>Setup Rewards Claim</h3>
                <ClaimSetupCard />
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </Web3OnboardProvider>
    </ApolloProvider>
  );
}

export default App;
