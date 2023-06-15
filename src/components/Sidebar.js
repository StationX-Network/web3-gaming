import React from "react";

const Sidebar = ({ onClickClaim, onClickLend, isOwner }) => {
  return (
    <div style={{ width: "100px", margin: "120px 0px 0px 12px" }}>
      <div onClick={onClickLend}>{!isOwner ? "Rent Assets" : "Lend Setup"}</div>
      <div onClick={onClickClaim} style={{ marginTop: "20px" }}>
        {!isOwner ? "Claim Rewards" : "Claim Setup"}
      </div>
    </div>
  );
};

export default Sidebar;
