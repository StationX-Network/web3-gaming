import { React, useEffect, useState } from "react";
import { rentNft } from "../helper/contractCalls";

export default function CollectionRentCard(props) {
  const { tokenName, nftData } = props;

  const [isRentNft, setIsRentNft] = useState(false);
  const [time, setTime] = useState(0);
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setIsLoading] = useState(false);

  const rentNftFn = async () => {
    setIsLoading(true);
    try {
      const { nftAddress, tokenID, getNftData } = nftData;
      const response = await rentNft(
        nftAddress,
        tokenID,
        time,
        nftData.lendingID
      );
      if (response.transactionHash) {
        setIsRentNft(false);
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
        {nftData.rentingID ? (
          <>
            <button
              style={{ marginTop: "36px" }}
              disabled={true}
              className='btn'
            >
              Asset Rented
            </button>
          </>
        ) : (
          <div>
            {!isRentNft && (
              <button
                style={{ marginTop: "36px" }}
                onClick={() => setIsRentNft(true)}
                className='btn'
              >
                Rent NFT
              </button>
            )}
            {isRentNft && (
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
                </div>
                <div>
                  <button onClick={rentNftFn} className='btn'>
                    {loading ? "Confirming ..." : "Confirm"}
                  </button>
                  <button onClick={() => setIsRentNft(false)} className='btn'>
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
