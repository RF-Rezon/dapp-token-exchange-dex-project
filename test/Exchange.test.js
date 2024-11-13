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
        token.transfer(user1, tokenFunc(100), { from: deployer });
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
    })

    describe('deposit tokens', () => {
        let result;
        let amount = tokenFunc(10);

        describe('success', () => {
            beforeEach(async () => {
                await token.approve(exchange.address, amount, { from: user1 });
                result = await exchange.depositToken(token.address, amount, { from: user1 });
            })
            it('tracks the token deposit', async () => {
                let balance;
                balance = await token.balanceOf(exchange.address);
                balance.toString().should.equal(amount.toString());
                balance = await exchange.tokens(token.address, user1);
                balance.toString().should.equal(amount.toString());
            })
            it('emits a deposit event', async () => {
                const log = result.logs[0];
                log.event.should.eq('Deposit');
                const event = log.args;
                event.token.toString().should.eq(token.address, 'token address is correct')
                event.user.toString().should.eq(user1, 'user is correct')
                event.amount.toString().should.eq(amount.toString(), 'amount is correct')  // eq is the short form of equal.
                event.balance.toString().should.eq(amount.toString(), 'balance is correct')
            })
        })
        describe('failure', () => {
            it('checks if trying deposit ether here', async() => {
                let invalidAmount = tokenFunc(10);
                await exchange.depositToken(INVALID_ADDRESS, invalidAmount, { from: user1 }).should.be.rejected;
            })
            it('fails when no tokens are approved', async () => {
                let invalidAmount = tokenFunc(10); 
                await exchange.depositToken(token.address, invalidAmount, { from: user1 }).should.be.rejectedWith(EVM_REVERT);
            })
        })
    })


})
