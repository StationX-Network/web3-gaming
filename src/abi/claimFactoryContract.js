export const claimFactoryAbi = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  { inputs: [], name: "InvalidAddress", type: "error" },
  { inputs: [], name: "InvalidAmount", type: "error" },
  { inputs: [], name: "InvalidTime", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_newClaimContract",
        type: "address"
      }
    ],
    name: "NewClaimContract",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32"
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32"
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32"
      }
    ],
    name: "RoleAdminChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32"
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address"
      }
    ],
    name: "RoleGranted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32"
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address"
      }
    ],
    name: "RoleRevoked",
    type: "event"
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "creatorAddress",
            type: "address"
          },
          {
            internalType: "address",
            name: "walletAddress",
            type: "address"
          },
          {
            internalType: "address",
            name: "airdropToken",
            type: "address"
          },
          {
            internalType: "address",
            name: "daoToken",
            type: "address"
          },
          {
            internalType: "bool",
            name: "hasAllowanceMechanism",
            type: "bool"
          },
          { internalType: "bool", name: "isNFT", type: "bool" },
          {
            internalType: "uint256",
            name: "nftTotalSupply",
            type: "uint256"
          },
          { internalType: "bool", name: "isEnabled", type: "bool" },
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256"
          },
          { internalType: "uint256", name: "endTime", type: "uint256" },
          {
            internalType: "address",
            name: "rollbackAddress",
            type: "address"
          },
          {
            internalType: "bytes32",
            name: "merkleRoot",
            type: "bytes32"
          },
          {
            internalType: "enum CLAIM_PERMISSION",
            name: "permission",
            type: "uint8"
          },
          {
            components: [
              {
                internalType: "bool",
                name: "isMaxClaimable",
                type: "bool"
              },
              {
                internalType: "uint256",
                name: "maxClaimable",
                type: "uint256"
              },
              {
                internalType: "uint256",
                name: "totalClaimAmount",
                type: "uint256"
              },
              {
                internalType: "uint256[]",
                name: "tokenIds",
                type: "uint256[]"
              }
            ],
            internalType: "struct ClaimAmountDetails",
            name: "claimAmountDetails",
            type: "tuple"
          },
          {
            components: [
              {
                internalType: "bool",
                name: "hasCooldownPeriod",
                type: "bool"
              },
              {
                internalType: "uint256",
                name: "cooldownPeriod",
                type: "uint256"
              }
            ],
            internalType: "struct CooldownDetails",
            name: "cooldownDetails",
            type: "tuple"
          }
        ],
        internalType: "struct ClaimSettings",
        name: "_claimSettings",
        type: "tuple"
      }
    ],
    name: "deployClaimContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "emitterContract",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes32", name: "role", type: "bytes32" }],
    name: "getRoleAdmin",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" }
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" }
    ],
    name: "hasRole",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" }
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" }
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_emitter", type: "address" }],
    name: "setEmitter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  }
];
