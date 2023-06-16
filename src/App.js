import { Web3OnboardProvider } from "@web3-onboard/react";
import { SUBGRAPH_CLIENT, web3Onboard } from "./helper/onboarding";
import { useEffect, useState } from "react";
import {
  fetchLends,
  fetchNfts,
  fetchRents,
  mergeData,
  nftsForRent,
  rentedNfts
} from "./helper/data";
import CollectionCard from "./components/CollectionCard";
import { DAO_ADDRESS } from "./helper/constants";
import { ApolloProvider } from "@apollo/client";
import Sidebar from "./components/Sidebar";
import ClaimSetupCard from "./components/ClaimSetupCard";
import ClaimRewardCard from "./components/ClaimRewardCard";
import RentedCard from "./components/RentedCard";
import "./App.css";
import CollectionRentCard from "./components/CollectionRentCard";

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
      const assetsData = await fetchNfts(DAO_ADDRESS);

      const lendsData = await fetchLends();

      const rentsData = await fetchRents();

      const data = mergeData(assetsData, lendsData, rentsData);

      setNftsData(data);
    };

    getNftData();
  }, []);

  console.log(nftsData);

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
              <> {isOwner ? <ClaimSetupCard /> : <ClaimRewardCard />} </>
            ) : (
              <>
                {!isOwner ? (
                  <>
                    {nftsData.size &&
                      Array.from(nftsData.values()).map((data, key) => {
                        return (
                          <CollectionCard
                            key={key}
                            tokenName={data.name || data.title}
                            nftData={data}
                          />
                        );
                      })}
                  </>
                ) : (
                  <>
                    {nftsData.size &&
                      Array.from(nftsData.values())
                        .filter((data) => data.lendingID)
                        .map((data, key) => {
                          return (
                            <CollectionRentCard
                              key={key}
                              tokenName={data.name || data.title}
                              nftData={data}
                            />
                          );
                        })}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </Web3OnboardProvider>
    </ApolloProvider>
  );
}

export default App;
