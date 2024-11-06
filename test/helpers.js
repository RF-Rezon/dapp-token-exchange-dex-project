function tokenFunc (params) {
    //   let x =  new web3.utils.BN(
    //     web3.utils.toWei(params.toString(), 'ether')
    //    )
       let wei = web3.utils.toWei(params.toString(), 'ether');
       return wei;
    }

const EVM_REVERT = "VM Exception while processing transaction: revert";
    
module.exports = { tokenFunc , EVM_REVERT };