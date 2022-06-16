
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: '0.8.11',
  networks: {
    ropsten: {
      url: "https://ropsten.infura.io/v3/71003bc940334e2db0ad7bafbfcb0533",
      accounts: ['6cce9ae3d260e22f8e90a2f967d60e24e3ec740b1aa59c3ae14eb074b380c529']
    }
  }
}
