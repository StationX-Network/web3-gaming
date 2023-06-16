import { Tooltip } from "@mui/material";
import React from "react";
import { GiPayMoney } from "react-icons/gi";
import { TbPigMoney } from "react-icons/tb";

const Sidebar = ({ onClickClaim, onClickLend, isOwner }) => {
  return (
    <div
      style={{
        width: "100px",
        marginLeft: "12px",
        display: "flex",
        alignItems: "center",
        flexDirection: "column"
      }}
    >
      <img
        src='/monogram.webp'
        height={60}
        width={60}
        alt='stationX'
        style={{
          margin: "25px 10px"
        }}
      />

      <Tooltip title={!isOwner ? "Rent Assets" : "Lend Setup"}>
        <div
          onClick={onClickLend}
          style={{
            background: "#27E2BE",
            padding: "12px",
            borderRadius: "20px",
            cursor: "pointer",
            marginTop: "40px"
          }}
        >
          <GiPayMoney
            style={{
              color: "#fff"
            }}
            size={40}
          />
        </div>
      </Tooltip>

      <Tooltip title={!isOwner ? "Claim Rewards" : "Claim Setup"}>
        <div
          onClick={onClickClaim}
          style={{
            background: "#27E2BE",
            padding: "12px",
            borderRadius: "20px",
            cursor: "pointer",
            marginTop: "24px"
          }}
        >
          <TbPigMoney size={40} style={{ color: "#fff" }} />
        </div>
      </Tooltip>
    </div>
  );
};

export default Sidebar;
