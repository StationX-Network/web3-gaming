// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

///@dev Admin role
bytes32 constant ADMIN = keccak256("ADMIN");

enum CLAIM_PERMISSION {
    ERC20Gated,
    ERC721Gated,
    Whitelisted,
    FreeForAll
}

struct ClaimSettings {
    address creatorAddress;
    address walletAddress; //Address of Safe/EOA
    address airdropToken; //Address of token to airdrop
    address daoToken; //Address of DAO token
    bool hasAllowanceMechanism; //To check if token transfer is based on allowance
    bool isNFT; //To check if airdrop token is nft
    uint nftTotalSupply; //Need to pass this as every contract doesn't have enumerable extension
    bool isEnabled; //To check if claim is enabled
    uint startTime; //Start time of claim
    uint endTime; //End time of claim
    address rollbackAddress; //Address to rollback remaining tokens to
    bytes32 merkleRoot; //Merkle root to validate proof
    CLAIM_PERMISSION permission;
    ClaimAmountDetails claimAmountDetails;
    CooldownDetails cooldownDetails;
}

struct ClaimAmountDetails {
    bool isMaxClaimable; //To check if there is max claim limit
    uint maxClaimable; //fixed claimable amount
    uint totalClaimAmount; //Total claim amount
    uint[] tokenIds; //TokenIds of NFT to airdrop
}

struct CooldownDetails {
    bool hasCooldownPeriod; //To check for cooldown peroid
    uint cooldownPeriod; //Time of cooldown period
}
