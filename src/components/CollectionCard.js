import { React, useEffect, useState } from "react";
import { lendNft } from "../helper/contractCalls";

export default function CollectionCard(props) {
  const { tokenName, nftData, getNftData } = props;

  const [isLendNft, setIsLendNft] = useState(false);
  const [price, setPrice] = useState(0);
  const [time, setTime] = useState(0);
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setIsLoading] = useState(false);

  const lendNftFn = async () => {
    setIsLoading(true);
    try {
      const { token_address, token_id } = nftData;
      const response = await lendNft({
        token_address,
        token_id,
        price,
        time
      });
      if (response.transactionHash) {
        setIsLendNft(false);
        setIsLoading(false);
        await getNftData();
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getNftImage = async () => {
      if (nftData?.rawMetadata?.image) {
        setImgUrl(nftData.rawMetadata.image);
        return;
      }
      if (nftData.token_uri?.startsWith("https://ipfs")) {
        const jsonString = nftData.metadata;
        const jsonObject = JSON.parse(jsonString);
        const tokenURI = jsonObject.image;
        let modifiedTokenURI;
        if (
          tokenURI.slice(tokenURI.indexOf("/"), tokenURI?.lastIndexOf("//"))
        ) {
          let imgUrl = tokenURI?.split("//");
          modifiedTokenURI = `https://${imgUrl[1]}.ipfs.dweb.link/${imgUrl[2]}`;
          setImgUrl(modifiedTokenURI);
        } else {
          let imgUrl = tokenURI?.split("/");
          if (imgUrl[3] === undefined) {
            modifiedTokenURI = tokenURI.replace(
              "ipfs://",
              "https://ipfs.io/ipfs/"
            );
            setImgUrl(modifiedTokenURI);
          } else {
            modifiedTokenURI = `https://ipfs.io/ipfs/${imgUrl[2]}/${imgUrl[3]}`;
            setImgUrl(modifiedTokenURI);
          }
        }
      } else {
        const response = await fetch(props.nftData.token_uri);
        const data = await response.json();
        const fetchedImageUrl = data.image;
        setImgUrl(fetchedImageUrl);
      }
    };

    getNftImage();
  }, [nftData]);

  return (
    <>
      <div className='card'>
        <div className='img-div'>
          <img
            style={{ maxWidth: "100%", borderRadius: "24px" }}
            src={imgUrl}
            alt='nftImage'
          />
        </div>
        <div className='nft-name'>{tokenName}</div>
        {nftData.lendingID ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px"
              }}
            >
              <div>Price ${(nftData.dailyRentPrice / 10 ** 6).toFixed(4)}</div>
              <div>Max Duration {nftData.maxRentDuration}d</div>
            </div>
            <button disabled={true} className='btn'>
              Asset Lent
            </button>
          </>
        ) : (
          <div>
            {!isLendNft && (
              <button
                style={{ marginTop: "36px" }}
                onClick={() => setIsLendNft(true)}
                className='btn'
              >
                Lend NFT
              </button>
            )}
            {isLendNft && (
              <>
                <div className='input-div'>
                  <div style={{ width: "80%", margin: "12px 12px" }}>
                    <label>Number of Days</label>
                    <input
                      style={{ marginRight: "12px" }}
                      placeholder='Number of Days'
                      type='number'
                      value={time}
                      onChange={(e) => {
                        setTime(e.target.value);
                      }}
                    />
                  </div>
                  <div style={{ width: "80%", margin: "12px 12px" }}>
                    <label>Price/Day</label>
                    <input
                      placeholder='Price / Day'
                      type='number'
                      value={price}
                      onChange={(e) => {
                        setPrice(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div>
                  <button onClick={lendNftFn} className='btn'>
                    {loading ? "Confirming ..." : "Confirm"}
                  </button>
                  <button onClick={() => setIsLendNft(false)} className='btn'>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
