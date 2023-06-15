import React, { useState } from "react";
import { deployClaimContract } from "../helper/contractCalls";

const ClaimSetupCard = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    setLoading(true);
    await deployClaimContract(description, amount);
    setLoading(false);
  };

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <label>Claim description</label>
        <input
          placeholder='Claim description'
          type='text'
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
      </div>
      <div>
        <label>Amount of tokens to be distributed</label>
        <input
          placeholder='Amount'
          type='number'
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
          }}
        />
      </div>
      <div style={{ width: "105%", textAlign: "center" }}>
        <button
          style={{ margin: "24px 0px 0px 24px" }}
          onClick={onConfirm}
          className='btn'
        >
          {loading ? "Deploying ..." : "Deploy new reward"}
        </button>
        <div style={{ marginTop: "12px" }}>
          Rewards will be distributed to all members on pro rata basis
        </div>
      </div>
    </div>
  );
};

export default ClaimSetupCard;
