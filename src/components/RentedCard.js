import { React, useState } from "react";
import { lendNft } from "../helper/contractCalls";

export default function RentedCard(props) {
  const { tokenName, imgUrl, price, days, upForRent } = props;
  const [isRentNft, setIsRentNft] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [time, setTime] = useState(0);
  const [rented, setRented] = useState(false);

  const rentNftFn = () => {
    setIsLoading(true);
    const { token_address, token_id } = props;
    const response = lendNft({
      token_address,
      token_id,
      price,
      time: time * 86400
    });
    if (response.transactionHash) {
      setIsRentNft(false);
      setRented(true);
    }
    setIsLoading(false);
  };

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
            fontSize: "small",
            justifyContent: "space-between",
            marginTop: "12px"
          }}
        >
          <div>$/day - {price} USDC</div>
          <div>
            {upForRent && !rented ? "Can rent for" : "Rented for"} - {days} days
          </div>
        </div>
        {!isRentNft && (
          <div>
            <button
              onClick={() => setIsRentNft(true)}
              disabled={!upForRent}
              className='btn'
            >
              {upForRent && !rented ? "Rent" : "Already Rented"}
            </button>
          </div>
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
    </>
  );
}
