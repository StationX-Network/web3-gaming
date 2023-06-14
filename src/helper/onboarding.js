import { init } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const polygonMainnet = {
  id: "0x89",
  token: "MATIC",
  label: "Polygon",
  rpcUrl:
    "https://polygon-mainnet.infura.io/v3/77fcda77b1d041e6841853e41de7345b"
};

const chains = [polygonMainnet];
const wallets = [injectedModule()];

const customTheme = {
  "--w3o-background-color": "#111d38",
  "--w3o-foreground-color": "#111d38",
  "--w3o-text-color": "#fff",
  "--w3o-border-color": "#ccc",
  "--w3o-action-color": "#007bff",
  "--w3o-border-radius": "24px"
};

export const web3Onboard = init({
  connect: {
    autoConnectLastWallet: true
  },
  theme: customTheme,
  wallets,
  chains,
  appMetadata: {
    name: "StaionX",
    icon: "<svg>My App Icon</svg>",
    description: "create DAO in 60 secs"
  },
  accountCenter: {
    desktop: {
      enabled: true,
      position: "topRight",
      minimal: false
    },
    mobile: {
      enabled: true,
      position: "topRight"
    }
  }
});

export const SUBGRAPH_CLIENT = new ApolloClient({
  uri: "",
  cache: new InMemoryCache()
});
