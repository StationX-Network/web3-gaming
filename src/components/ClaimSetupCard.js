import React, { useState } from "react";
import { deployClaimContract } from "../helper/contractCalls";

const ClaimSetupCard = () => {
  const [description, setDescription] = useState(
    "Distribution of rewards earned from Asset Renting"
  );
  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(false);

  const onConfirm = async () => {
    setLoading(true);
    await deployClaimContract(amount);
    setLoading(false);
  };

  return (
    <div style={{ width: "60vw" }}>
      <h3>Setup Rewards Claim</h3>
      <div className='claim-input-div'>
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
      <div className='claim-input-div'>
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
      <div className='claim-input-div'>
        <label>Token to be distributed</label>
        <select value='usdc' placeholder='Select Token'>
          <option value='btc'>BTC</option>
          <option value='eth'>ETH</option>
          <option value='bnb'>BNB</option>
          <option value='usdc'>USDC</option>
          <option value='usdt'>USDT</option>
        </select>
      </div>
      <div className='claim-input-div'>
        <label>Can be claimed by</label>
        <select value={"3"} placeholder='Select'>
          <option value='1'>Everyone</option>
          <option value='2'>Upload CSV</option>
          <option value='3'>Pro Rata</option>
        </select>
      </div>
      <div style={{ width: "100%", textAlign: "center" }}>
        <button onClick={onConfirm} className='btn'>
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
