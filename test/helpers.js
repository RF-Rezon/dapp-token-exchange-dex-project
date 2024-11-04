function tokenFunc (params) {
    //   let x =  new web3.utils.BN(
    //     web3.utils.toWei(params.toString(), 'ether')
    //    )
       let wei = web3.utils.toWei(params.toString(), 'ether');
       return wei;
    }
    
module.exports = { tokenFunc };