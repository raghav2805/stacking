
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: '0.8.11',
  networks: {
    ropsten: {
      url: "https://ropsten.infura.io/v3/71003bc940334e2db0ad7bafbfcb0533",
      accounts: ['5431a34a614fae4c15a7040bb16916d5100ece3d02af7a2be3e1157bbf0846ad']
    }
  }
}
