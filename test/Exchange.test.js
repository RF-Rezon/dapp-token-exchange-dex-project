const { tokenFunc, EVM_REVERT, INVALID_ADDRESS } = require('./helpers');

const Exchange = artifacts.require('./Exchange');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Exchange', ([deployer, feeAccount]) => {

    let exchange;
    const feePercent = 10;

    beforeEach(async () => {  
        exchange = await Exchange.new(feeAccount, feePercent);
    })

    describe('deployment', () => {
        it('tracks the fee account', async () => {
            const result = await exchange.feeAccount();
            result.toString().should.equal(feeAccount.toString());
        })
        it('tracks the fee percent', async () => {
            const result = await exchange.feePercent();
            result.toString().should.equal(feePercent.toString());
        })
    });
})
