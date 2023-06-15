import { React } from "react";

export default function RentedCard(props) {
  const { tokenName, imgUrl, price, days } = props;

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
          <div>Price / Day - {price} USDC</div>
          <div>Rented for - {days} days</div>
        </div>
        <div>
          <button disabled={true} className='btn'>
            Already Rented
          </button>
        </div>
      </div>
    </>
  );
}
