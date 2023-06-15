require("dotenv").config({ path: __dirname + "./../.env" });
const RINKEBY_CONFIG = require("./rinkeby.config");
const GOERLI_CONFIG = require("./goerli.config");
const POLYGON_CONFIG = require("./polygon.config");
const MAINNET_CONFIG = require("./mainnet.config");

var EXPORT_CONFIG;

if (process.env.NETWORK == "rinkeby") {
  EXPORT_CONFIG = RINKEBY_CONFIG;
} else if (process.env.NETWORK == "goerli") {
  EXPORT_CONFIG = GOERLI_CONFIG;
} else if (process.env.NETWORK == "polygon") {
  EXPORT_CONFIG = POLYGON_CONFIG;
} else if (process.env.NETWORK == "mainnet") {
  EXPORT_CONFIG = MAINNET_CONFIG;
} else {
  EXPORT_CONFIG = {};
}

module.exports = EXPORT_CONFIG;
