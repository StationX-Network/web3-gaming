require("dotenv").config({ path: __dirname + "./../.env" });

module.exports = {
  USDC: process.env.POLYGON_USDC,
  RPC_URL: process.env.POLYGON_URL,
  FACTORY_ADDRESS: process.env.POLYGON_FACTORY,
  NETWORK: "polygon",
  ETHERSCAN_API_KEY: process.env.POLYGON_API_KEY
};
