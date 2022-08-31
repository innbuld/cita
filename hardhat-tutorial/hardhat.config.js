require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const ANKR_API_KEY = process.env.ANKR_API_KEY;

const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: ANKR_API_KEY,
      accounts: [GOERLI_PRIVATE_KEY],
    },
  },
};