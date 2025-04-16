
const hre = require("@nomicfoundation/hardhat-ethers"); 
const { getContractFactory } = require("@nomicfoundation/hardhat-ethers/types");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks:{
    localhost:{
      url:"http://127.0.0.1:8545"
    },
    sepolia:{
      url:"https://eth-sepolia.g.alchemy.com/v2/N_8R86TRYp_bdsuXh9HhNiTakK3QNZTO",
      accounts:["0x1040ae96c80ed4172fa44c2951a13de8f9d7533bddef535b74c7ef77a199d4a0", "0x4b95e8982a6aba71635b0854a19e4d92638ca0e93f47c28e8004f5d326d2ac6b"]
    }
  }
 
};