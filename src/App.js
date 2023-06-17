import { Web3OnboardProvider } from "@web3-onboard/react";
import { SUBGRAPH_CLIENT, web3Onboard } from "./helper/onboarding";
import { useEffect, useState } from "react";
import { fetchLends, fetchNfts, fetchRents, mergeData } from "./helper/data";
import CollectionCard from "./components/CollectionCard";
import { DAO_ADDRESS } from "./helper/constants";
import { ApolloProvider } from "@apollo/client";
import Sidebar from "./components/Sidebar";
import ClaimSetupCard from "./components/ClaimSetupCard";
import ClaimRewardCard from "./components/ClaimRewardCard";
import CollectionRentCard from "./components/CollectionRentCard";
import "./App.css";

function App() {
  const [nftsData, setNftsData] = useState([]);
  const [selected, setSelected] = useState("Lend");
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const getNftData = async () => {
    try {
      const assetsData = await fetchNfts(DAO_ADDRESS);

      const lendsData = await fetchLends();

      const rentsData = await fetchRents();

      const data = mergeData(assetsData, lendsData, rentsData);

      setNftsData(data);

      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
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
          {loading ? (
            <div
              style={{
                display: "flex",
                height: "100vh",
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <h1> Loading...</h1>
            </div>
          ) : (
            <div className='listing-div'>
              <div
                style={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "center",
                  width: "90vw"
                }}
              >
                <h1>Gaming Guild Assets</h1>
              </div>
              {selected === "Claim" ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center"
                  }}
                >
                  {isOwner ? <ClaimSetupCard /> : <ClaimRewardCard />}{" "}
                </div>
              ) : (
                <>
                  {isOwner ? (
                    <>
                      {nftsData.size &&
                        Array.from(nftsData.values()).map((data, key) => {
                          return (
                            <CollectionCard
                              key={key}
                              tokenName={data.name || data.title}
                              nftData={data}
                              getNftData={getNftData}
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
                                getNftData={getNftData}
                              />
                            );
                          })}
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </Web3OnboardProvider>
    </ApolloProvider>
  );
}

export default App;
