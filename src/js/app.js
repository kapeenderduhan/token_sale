App={
      web3Provider:null,
      contracts:{},
      account:"0X0",
      loading:false,
      tokenPrice: 1000000000000000,
      tokensSold: 0,
      tokensAvailable: 750000,

    init:function(){
         console.log("app initialised");
         return App.initWeb3();
    },

    initWeb3: function() {
      if (typeof web3 !== 'undefined') {
        // If a web3 instance is already provided by Meta Mask.
        App.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
        console.log("metamask connected");
      } else {
        // Specify default instance if no web3 instance provided
        window.alert("Add metamask extension to purchase tokens!!");
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        web3 = new Web3(App.web3Provider);
        console.log("localhost connected!!");
      }
      return App.initContracts();
    },
    initContracts:function(){
       $.getJSON("DcrustTokenSale.json",function(dcrustTokenSale){
         App.contracts.DcrustTokenSale= TruffleContract(dcrustTokenSale);
         App.contracts.DcrustTokenSale.setProvider(App.web3Provider);
         App.contracts.DcrustTokenSale.deployed().then(function(dcrustTokenSale){
            console.log("DcrustToken Sale Address",dcrustTokenSale.address);
            
         });
       }).done(function(){
        $.getJSON("DcrustToken.json",function(dcrustToken){
          App.contracts.DcrustToken= TruffleContract(dcrustToken);
          App.contracts.DcrustToken.setProvider(App.web3Provider);
          App.contracts.DcrustToken.deployed().then(function(dcrustToken){
             console.log("DcrustToken Address",dcrustToken.address);
          });
          App.listenForEvents();

          return App.render();
       });
      })
    },
      
    listenForEvents: function() {
      App.contracts.DcrustTokenSale.deployed().then(function(instance) {
        instance.Sell({}, {
          fromBlock: 0,
          toBlock: 'latest',
        }).watch(function(error, event) {
          console.log("event triggered", event);
          App.render();
        })
      })
    },
 
    render: function() {
      if (App.loading) {
        return;
      }
      App.loading = true;
  
      var loader  = $('#loader');
      var content = $('#content');
  
      loader.show();
      content.hide();
  
      // Load account data
      web3.eth.getCoinbase(function(err, account) {
        if(err === null) {
          App.account = account;
          if(App.account==null){
            window.alert("connect your metamask extension and login !!");
          }
          $('#accountAddress').html("Your Account: " + account);
        }
        if(err)
        {
           console.log(" error connecting to blockchain");
        }
      })
  
      // Load token sale contract
      App.contracts.DcrustTokenSale.deployed().then(function(instance) {
        dappTokenSaleInstance = instance;
        return dappTokenSaleInstance.tokenPrice();
      }).then(function(tokenPrice) {
        App.tokenPrice = tokenPrice;
        $('.token-price').html(web3.fromWei(App.tokenPrice, "ether").toNumber());
        return dappTokenSaleInstance.tokensSold();
      }).then(function(tokensSold) {
        App.tokensSold = tokensSold.toNumber();
        $('.tokens-sold').html(App.tokensSold);
        $('.tokens-available').html(App.tokensAvailable);
  
        var progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
        $('#progress').css('width', progressPercent + '%');
  
        // Load token contract
        App.contracts.DcrustToken.deployed().then(function(instance) {
          dappTokenInstance = instance;
          //console.log(App.account);
          return dappTokenInstance.balanceOf(App.account);
        }).then(function(balance) {
          $('.dapp-balance').html(balance.toNumber());
          App.loading = false;
          loader.hide();
          content.show();
        })
      });
    },

    buyTokens: function() {
      $('#content').hide();
      $('#loader').show();
      var numberOfTokens = $('#numberOfTokens').val();
      App.contracts.DcrustTokenSale.deployed().then(function(instance) {
        return instance.buyTokens(numberOfTokens, {
          from: App.account,
          value: numberOfTokens * App.tokenPrice,
          gas: 500000 // Gas limit
        });
      }).then(function(result) {
         if(result){
        console.log("Tokens bought...");
        $('form').trigger('reset'); // reset number of tokens in form
        // Wait for Sell event
        }
      });
    }
    
  
}
$(function(){

    


    $(window).load(function(){


      

        App.init();
    })
});
