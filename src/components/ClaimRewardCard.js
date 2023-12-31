import React, { useState } from "react";
import { claim } from "../helper/contractCalls";

const ClaimRewardCard = () => {
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    setLoading(true);
    await claim();
    setLoading(false);
  };

  return (
    <div
      style={{
        width: "60vw",
        textAlign: "center",
        marginTop: "35vh"
      }}
    >
      <div style={{ width: "100%", textAlign: "center" }}>
        <button onClick={onConfirm} className='btn'>
          {loading ? "Claiming ..." : "Claim Rewards Earned From Asset Renting"}
        </button>
        <div style={{ marginTop: "12px" }}>
          Rewards will be distributed to all members on pro rata basis
        </div>
      </div>
    </div>
  );
};

export default ClaimRewardCard;
