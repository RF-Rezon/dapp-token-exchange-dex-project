function tokenFunc (params) {
    //   let x =  new web3.utils.BN(
    //     web3.utils.toWei(params.toString(), 'ether')
    //    )
       let wei = web3.utils.toWei(params.toString(), 'ether');
       return wei;
    }

    function etherFunc (params) {
       return tokenFunc(params);
    }

const EVM_REVERT = "VM Exception while processing transaction: revert";

const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';
    
module.exports = { tokenFunc , EVM_REVERT, ETHER_ADDRESS, etherFunc };