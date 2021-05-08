const DcrustToken = artifacts.require("DcrustToken");
const DcrustTokenSale =artifacts.require("DcrustTokenSale");
module.exports = function (deployer) {
   return deployer.deploy(DcrustToken,1000000).then(function()
   {
      // Token price is 0.001 Ether
    var tokenPrice = 1000000000000000;
    return deployer.deploy(DcrustTokenSale, DcrustToken.address, tokenPrice);

   });
};
