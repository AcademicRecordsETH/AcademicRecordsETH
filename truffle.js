var HDWalletProvider = require("truffle-hdwallet-provider");

var fs = require('fs');
var path = process.cwd();
var walletMmnemonic = fs.readFileSync(path + "/private/wallet.mnemonic").toString();
//console.log(walletMmnemonic);
var apiKey = fs.readFileSync(path + "/private/api.key").toString();
//console.log(apiKey);

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      gas: 7000000,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(
          walletMmnemonic,
          "https://rinkeby.infura.io/v3/" + apiKey)
      },
      gas: 7000000,
      network_id: 4
    }
  }
};
