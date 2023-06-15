import React, { useState } from "react";
import { deployClaimContract } from "../helper/contractCalls";

const ClaimRewardCard = () => {
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    setLoading(true);
    await deployClaimContract();
    setLoading(false);
  };

  return (
    <div style={{ width: "60vw" }}>
      <h3>Get Rewards of Asset Renting</h3>
      <div style={{ width: "100%", textAlign: "center" }}>
        <button onClick={onConfirm} className='btn'>
          {loading ? "Claiming ..." : "Claim Rewards"}
        </button>
        <div style={{ marginTop: "12px" }}>
          Rewards will be distributed to all members on pro rata basis
        </div>
      </div>
    </div>
  );
};

export default ClaimRewardCard;
