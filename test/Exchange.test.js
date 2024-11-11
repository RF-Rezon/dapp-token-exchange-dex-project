const { fromPairs } = require('lodash');
const { tokenFunc, EVM_REVERT, INVALID_ADDRESS } = require('./helpers');

const Exchange = artifacts.require('./Exchange');
const Token = artifacts.require('./Token');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Exchange', ([deployer, feeAccount, user1]) => {

    let exchange;
    let token;
    const feePercent = 10;

    beforeEach(async () => {  
        token = await Token.new();
        token.transfer(user1, tokenFunc(100), {from: deployer});
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

    describe('deposit tokens',() => {

        let amount = tokenFunc(10); 
            beforeEach(async () => {  
                await token.approve(exchange.address, amount, { from: user1});
                await exchange.depositToken(token.address, amount, { from: user1});
            })
            describe('success',() => {
                it('tracks the token deposit', async () => {
                let balance;
                balance = await token.balanceOf(exchange.address);
                balance.toString().should.equal(amount.toString())
                })
            })
            describe('failure',() => {
           
            })
        })
    
})
