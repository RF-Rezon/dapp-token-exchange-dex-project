const { tokenFunc, etherFunc, EVM_REVERT, INVALID_ADDRESS } = require('./helpers');

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
    });

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

    // describe('fallback',()=>{
    //     it('reverts when Ether is sent', async()=>{
    //         await exchange.sendTransaction({value: 1, from: user1}).should.be.rejectedWith(EVM_REVERT);
    //     })
    // });

    // describe('deposit ether', () => {
    //     let amount = etherFunc(1);
    //     beforeEach(async()=>{
    //         await exchange.depositEther({from: user1, value: amount});
    //     })
    //     it('tracks the ether deposit', async() => {
    //         const balance = await exchange.tokens(INVALID_ADDRESS, user1);
    //         balance.toString().should.equal(amount.toString())
    //     })
    // });

    // describe('withdraw ether', () => {
    //     let result; 
    //     let amount = etherFunc(1);
    
    //     describe('success', () => {
    //         beforeEach(async () => {
    //             // Deposit Ether before withdrawal
    //             await exchange.depositEther({ from: user1, value: amount });
    //             // Perform withdrawal and store the transaction result
    //             result = await exchange.withdrawEther(amount, { from: user1 });
    //         })
    
    //         it('withdraws Ether funds', async () => {
    //             const balance = await exchange.tokens(INVALID_ADDRESS, user1);            
    //             balance.toString().should.equal('0');
    //         })
    
    //         it('emits a withdraw event', () => {
    //             const log = result.logs[0];
    //             log.event.should.eq('Withdraw');
    //             const event = log.args;
    //             event.token.should.eq(INVALID_ADDRESS, 'token address is correct');
    //             event.user.should.eq(user1, 'user is correct');
    //             event.amount.toString().should.eq(amount.toString(), 'amount is correct');
    //             event.balance.toString().should.eq('0', 'balance is correct');
    //         })
    //     });
    
    //     describe('failure', () => {
    //         it('rejects withdrawals exceeding the balance', async () => {
    //             await exchange.withdrawEther(etherFunc(2), { from: user1 }).should.be.rejectedWith(EVM_REVERT);
    //         });
    //     });    
    // });

    // describe('deposit tokens', () => {
    //     let result;
    //     let amount;

    //     describe('success', () => {
    //         beforeEach(async () => {
    //             amount = tokenFunc(10);
    //             await token.approve(exchange.address, amount, { from: user1 });
    //             result = await exchange.depositToken(token.address, amount, { from: user1 });
    //         })
    //         it('tracks the token deposit', async () => {
    //             let balance;
    //             balance = await token.balanceOf(exchange.address);
    //             balance.toString().should.equal(amount.toString());
    //             balance = await exchange.tokens(token.address, user1);
    //             balance.toString().should.equal(amount.toString());
    //         })
    //         it('emits a deposit event',() => {
    //             const log = result.logs[0];
    //             log.event.should.eq('Deposit');
    //             const event = log.args;
    //             event.token.should.eq(token.address, 'token address is correct')
    //             event.user.should.eq(user1, 'user is correct')
    //             event.amount.toString().should.eq(amount.toString(), 'amount is correct')  // eq is the short form of equal.
    //             event.balance.toString().should.eq(amount.toString(), 'balance is correct')
    //         })
    //     })
    //     describe('failure', () => {
    //         it('checks if trying deposit ether here', async() => {
    //             let invalidAmount = etherFunc(10);
    //             await exchange.depositToken(INVALID_ADDRESS, invalidAmount, { from: user1 }).should.be.rejected;
    //         })
    //         it('fails when no tokens are approved', async () => {
    //             let invalidAmount2 = tokenFunc(10); 
    //             await exchange.depositToken(token.address, invalidAmount2, { from: user1 }).should.be.rejectedWith(EVM_REVERT);
    //         })
    //     })
    // });

    // describe('withdraw token', () => {
    //     let result; 
    //     let amount;
    //     describe('success', () => {
    //         beforeEach(async () => {
    //             amount = tokenFunc(10);
    //             // Approve first
    //             await token.approve(exchange.address, amount, {from: user1 });
    //             // Deposit Token before withdrawal
    //             await exchange.depositToken(token.address, amount, { from: user1 });
    //             // Perform withdrawal and store the transaction result
    //             result = await exchange.withdrawToken(token.address, amount, { from: user1 });
    //         })
    
    //         it('withdraws Token funds', async () => {
    //             const balance = await exchange.tokens(token.address, user1);            
    //             balance.toString().should.equal('0');
    //         })
    
    //         it('emits a withdraw event', () => {
    //             const log = result.logs[0];
    //             log.event.should.eq('Withdraw');
    //             const event = log.args;
    //             event.token.should.eq(token.address);
    //             event.user.should.eq(user1);
    //             event.amount.toString().should.eq(amount.toString());
    //             event.balance.toString().should.eq('0');
    //         })
    //     });
    
    //     describe('failure', () => {
    //      const invalidAmmount = tokenFunc(100);
    //         it('rejects withdrawals exceeding the balance', async () => {
    //             await exchange.withdrawToken(token.address, invalidAmmount, { from: user1 }).should.be.rejectedWith(EVM_REVERT);
    //         });
    //         it('rejects if Ether withdrawals', async () => {
    //             await exchange.withdrawToken(INVALID_ADDRESS, amount, { from: user1 }).should.be.rejectedWith(EVM_REVERT);
    //         });
    //     });    
    // });
})
