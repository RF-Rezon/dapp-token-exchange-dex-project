const { tokenFunc, etherFunc, EVM_REVERT, INVALID_ADDRESS } = require('./helpers');

const Exchange = artifacts.require('./Exchange');
const Token = artifacts.require('./Token');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Exchange', ([deployer, feeAccount, user1, user2]) => {
    
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


    // describe('checking balance', () => {
    //     let amount;
    //     beforeEach(async () => {
    //         amount = etherFunc(10);
    //         await exchange.depositEther({ from: user1, value: amount });
    //     })

    //     it('returns user balance', async () => {
    //         const balance = await exchange.balanceOf(INVALID_ADDRESS, user1);
    //         balance.toString().should.equal(amount.toString());
    //     })
    // });

    describe('making orders', async () => {
        let result;

        beforeEach(async () => {
            result = await exchange.makeOrder(token.address, tokenFunc(1), INVALID_ADDRESS, etherFunc(1), {from: user1});
        }); 

        it('tracks the newly created order', async () => {
            // Attempt to withdraw tokens without having made a deposit first
            const orderCount = await exchange.orderCount();
            orderCount.toString().should.equal('1');

            const order = await exchange.orders('1');
            order.id.toString().should.equal('1', 'order id is correct');
            order.user.should.equal(user1, 'user is correct');
            order.tokenGet.should.equal(token.address, 'tokenGive is correct');
            order.amountGet.toString().should.equal(tokenFunc(1).toString(), 'amountGet is correct');
            order.tokenGive.should.equal(INVALID_ADDRESS, 'tokenGive is correct');
            order.amountGive.toString().should.equal(etherFunc(1).toString(), 'amountGive is correct');
            order.timestamp.toString().length.should.be.at.least(1, 'timestamp is present');
        }); 
        
        it('emits an "Order" event', async() => {
            const log = result.logs[0];
            log.event.should.equal('Order');
            const event = log.args;
            event.id.toString().should.equal('1', 'id is correct');
            event.user.toString().should.equal(user1, 'user is correct');
            event.tokenGet.should.equal(token.address, 'tokenGet is correct');
            event.amountGet.toString().should.equal(tokenFunc(1).toString(), 'amountGet is correct');
            event.tokenGive.should.equal(INVALID_ADDRESS, 'tokenGive is correct');
            event.amountGive.toString().should.equal(etherFunc(1).toString(), 'amountGive is correct');
            event.timestamp.toString().length.should.be.at.least(1, 'timestamp is present');
        });
    });

    // describe('order actions', () => {
    //     beforeEach(async() => {
    //         // user 1 deposits ether only 
    //         await exchange.depositEther({from: user1, value: etherFunc(5)})
    //         // give tokens to user 2
    //         await token.transfer(user2, tokenFunc(100), {from: deployer})
    //         // user 2 deposits tokens only 
    //         await token.approve(exchange.address, tokenFunc(100), {from: user2});
    //         await exchange.depositToken(token.address, tokenFunc(100), {from: user2});

    //         // user1 makes an order to buy tokens with Ether
    //         await exchange.makeOrder(token.address, tokenFunc(2), INVALID_ADDRESS, etherFunc(2), {from: user1})
    //     });

    //     describe('filling orders', async () => {
    //         let result;

    //         describe('success', async () => {
    //             beforeEach(async () => {
    //                 // user2 fills the order
    //                 result = await exchange.fillOrder('1', {from: user2});
    //             });

    //             it('executes the order & charges fees', async () => {
    //                 let balance;
    //                 balance = await exchange.balanceOf(token.address, user1);
    //                 balance.toString().should.equal(tokenFunc(2).toString(), 'user1 received tokens');
    //                 balance = await exchange.balanceOf(INVALID_ADDRESS, user2);
    //                 balance.toString().should.equal(etherFunc(1).toString(), 'user2 received ether');
    //                 balance = await exchange.balanceOf(INVALID_ADDRESS, user1);
    //                 balance.toString().should.equal(etherFunc(4).toString(), 'user1 Ether deducted');
    //                 balance = await exchange.balanceOf(token.address, user2);
    //                 balance.toString().should.equal(tokenFunc(97.8).toString(), 'user2 tokens deducted');
    //                 balance = await exchange.balanceOf(token.address, feeAccount);
    //                 balance.toString().should.equal(tokenFunc(0.2).toString(), 'feeAccount received fee');
    //             });

    //             it('updates filled orders', async () => {
    //                 let orderFilled = await exchange.orderFilled('1');
    //                 orderFilled.should.equal(true); 
    //             });

    //             it('emits a "Trade" event', async () => {
    //                 const log = result.logs[0];
    //                 log.event.should.equal('Trade');
    //                 const event = log.args;
    //                 event.id.toString().should.equal('1', 'id is correct');
    //                 event.user.should.equal(user1, 'user is correct');
    //                 event.tokenGet.should.equal(token.address, 'tokenGet is correct');
    //                 event.amountGet.toString().should.equal(tokenFunc(2).toString(), 'amountGet is correct');
    //                 event.tokenGive.should.equal(INVALID_ADDRESS, 'tokenGive is correct');
    //                 event.amountGive.toString().should.equal(etherFunc(1).toString(), 'amountGive is correct');
    //                 event.userFill.should.equal(user2, 'userFill is correct')
    //             });
    //         });

    //         describe('failure', async () => {
    //             it('rejects invalid order ids', async () => {
    //                 const invalidOrderId = 99999;
    //                 await exchange.fillOrder(invalidOrderId, {from: user2}).should.be.rejectedWith(EVM_REVERT);                
    //             });

    //             it('rejects already filled orders', async () => {
    //                 // Fill the order
    //                 await exchange.fillOrder(1, {from: user2}).should.be.fulfilled;
    //                 // Try again to fill the order
    //                 await exchange.fillOrder(1, {from: user2}).should.be.rejectedWith(EVM_REVERT);
    //             });

    //             it('rejects cancelled orders', async () => {
    //                 // Cancel the order
    //                 await exchange.cancelOrder(1, {from: user1}).should.be.fulfilled;
    //                 // Try again to fill the order
    //                 await exchange.fillOrder(1, {from: user2}).should.be.rejectedWith(EVM_REVERT);
    //             });
    //         });
    //     });

    //     describe('cancelling orders', () => {
    //         let result;
    //         describe('success', () => {
    //             beforeEach(async () => {
    //                 result = await exchange.cancelOrder('1', { from: user1})
    //             })
    
    //             it('updates cancelled orders', async () => {
    //                 const orderCancelled = await exchange.orderCancelled(1)
    //                 orderCancelled.should.eq(true)
    //             })
    
    //             it('emits a "Cancel" event', () => {
    //                 const log = result.logs[0];
    //                 log.event.should.eq('Cancel');
    //                 const event = log.args;
    //                 event.id.toString().should.eq('1', 'id is correct')
    //                 event.user.should.eq(user1, 'user is correct')
    //                 event.tokenGet.should.eq(token.address, 'tokenGet is correct')
    //                 event.amountGet.toString().should.eq(tokenFunc(1).toString(), 'amountGet is correct')
    //                 event.tokenGive.should.eq(INVALID_ADDRESS, 'tokenGive is correct')
    //                 event.amountGive.toString().should.eq(etherFunc(1).toString(), 'amountGive is correct')
    //                 event.timestamp.toString().length.should.be.at.least(1, 'timestamp is present')
    //             })
    //         });
    //     });
    // });

})
