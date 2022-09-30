require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");

const { PRIVATE_KEY, MAINNET_JSON_RPC, BSC_JSON_RPC, RINKEBY_JSON_RPC } = process.env;
var local_ip = "192.168.0.67";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version:"0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 50,
      }
    }
  },
  defaultNetwork: "local",
  mocha: {
    timeout: 100000000000
  },

  networks: {
    mainnet: {
      accounts: [`0x${PRIVATE_KEY}`],
      url: MAINNET_JSON_RPC,
    },

    rinkeby: {
      url: RINKEBY_JSON_RPC,
      accounts: [`0x${PRIVATE_KEY}`],
    },

    bsc: {
      accounts: [`0x${PRIVATE_KEY}`],
      url: BSC_JSON_RPC,
    },

    local: {
      url: `http://${local_ip}:8545`,
      accounts: ['0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80']
    }
  }
   

};
