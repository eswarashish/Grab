 
$(document).ready(function() {
    let account;
  $("#wallet").hide();
  
    $("#connectM").on('click', _event => {
       
        
        ethereum.request({method: 'eth_requestAccounts'}).then(accounts => {
          account = accounts[0];
          console.log(account);
      
        });
      });
      $("#closewallet").on('click', function () {
        
        
      $("#wallet").hide();
      
        
      });
    $("#menU").hide(); 
$("#womenU").hide();
$("#connect").on("click", function () {
    $("#wallet").show()
})

    $(".menuicon").on("click" , function () {
        $("#menU").toggle();       })
        $("#womenicon").on("click" , function () {
            $("#womenU").toggle();       })
$("#relativeclose").on("click", function () {
    $("#relativemenu").hide();
    
})
$("#sidecart").hide()
$("#carticon").on("click", function () {
    $("#sidecart").show();
})
$("#cartclose").on("click", function () {
    $("#sidecart").hide();

})

$("#checkout").on("click", function () {
    let transactionParam ={
to: "0x21EEa749319c9FD9B4e83920305A3452791173B4",
from: account,
value: "0x58C44554800"    }

ethereum.request({method: 'eth_sendTransaction', params: [transactionParam]}).then(txhash =>{
    alert(txhash);
    console.log(txhash);
    checkTrans(txhash).then(r => alert(r));
})

})

function checkTrans(txhash) {
    let checktransloop = () => {
        return ethereum.request({method: 'eth_getTransactionReceipt', params: [txhash]}).then(r => {
            if(r!= null) return 'confirmed';
            else return checktransloop();
        });

    }

    return checktransloop();
}



})

