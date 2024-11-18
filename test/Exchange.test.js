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

    describe('making orders', () => {
        let result;
        beforeEach(async () => {
            result = await exchange.makeOrder(token.address, tokenFunc(1), INVALID_ADDRESS, etherFunc(1), { from: user1 });
        })

        it('tracks the newly created order', async () => {
            const orderCount = await exchange.orderCount();
            orderCount.toString().should.eq('1')
            const order = await exchange.orders('1')
            order.id.toString().should.eq('1', 'id is correct')
            order.user.should.eq(user1, 'user is correct')
            order.tokenGet.should.eq(token.address, 'tokenGet is correct')
            order.amountGet.toString().should.eq(tokenFunc(1).toString(), 'amountGet is correct')
            order.tokenGive.should.eq(INVALID_ADDRESS, 'tokenGive is correct')
            order.amountGive.toString().should.eq(etherFunc(1).toString(), 'amountGive is correct')
            order.timestamp.toString().length.should.be.at.least(1, 'timestamp is present')
        })

        it('emits an "Order" event', () => {
            const log = result.logs[0];
            log.event.should.eq('Order');
            const event = log.args;
            event.id.toString().should.eq('1', 'id is correct')
            event.user.should.eq(user1, 'user is correct')
            event.tokenGet.should.eq(token.address, 'tokenGet is correct')
            event.amountGet.toString().should.eq(tokenFunc(1).toString(), 'amountGet is correct')
            event.tokenGive.should.eq(INVALID_ADDRESS, 'tokenGive is correct')
            event.amountGive.toString().should.eq(etherFunc(1).toString(), 'amountGive is correct')
            event.timestamp.toString().length.should.be.at.least(1, 'timestamp is present')
        })
    });

    describe('order actions', () => {
        beforeEach(async() => {
            // user 1 deposits ether only 
            await exchange.depositEther({from: user1, value: etherFunc(1)})
            // give tokens to user 2
            await token.transfer(feeAccount, tokenFunc(100), {from: deployer})
            // user 2 deposits tokens only 
            await token.approve(exchange.address, tokenFunc(2), {from: feeAccount});
            await exchange.depositToken(token.address, tokenFunc(2), {from: feeAccount});

            // user1 makes an order to buy tokens with Ether
            await exchange.makeOrder(token.address, tokenFunc(1), INVALID_ADDRESS, etherFunc(1), {from: user1})
        });

        describe('filling orders', () => {
            let result;
            describe('success', () => {
                beforeEach(async () => {
                    result = await exchange.fillOrder('1', { from: feeAccount})
                })

                it('executes the trade & charges fees', async () => {
                    let balance;
                
                    // Check user1 received tokens
                    balance = await exchange.balanceOf(token.address, user1);
                    balance.toString().should.eq(tokenFunc(1).toString(), 'user1 received tokens');
                
                    // Check user2 received Ether
                    balance = await exchange.balanceOf(INVALID_ADDRESS, feeAccount);
                    balance.toString().should.eq(etherFunc(1).toString(), 'user2 received Ether');
                
                    // Check user2 Ether deducted
                    balance = await exchange.balanceOf(INVALID_ADDRESS, user1);
                    balance.toString().should.eq('0', 'user2 Ether deducted');
                
                    // Check feeAccount received fee
                    balance = await exchange.balanceOf(token.address, feeAccount);
                    balance.toString().should.eq(tokenFunc(0.1).toString(), 'feeAccount received fee');
                });

                it('updates filled orders', async () => {
                    const orderFilled = await exchange.orderFilled(1)
                    orderFilled.should.eq(true)
                })
                
    
                it('emits a "Trade" event', () => {
                    const log = result.logs[0];
                    log.event.should.eq('Trade');
                    const event = log.args;
                    event.id.toString().should.eq('1', 'id is correct')
                    event.user.should.eq(user1, 'user is correct')
                    event.tokenGet.should.eq(token.address, 'tokenGet is correct')
                    event.amountGet.toString().should.eq(tokenFunc(1).toString(), 'amountGet is correct')
                    event.tokenGive.should.eq(INVALID_ADDRESS, 'tokenGive is correct')
                    event.amountGive.toString().should.eq(etherFunc(1).toString(), 'amountGive is correct')
                    event.userFill.toString().should.eq(feeAccount.toString(), 'feeAccount is correct')
                    event.timestamp.toString().length.should.be.at.least(1, 'timestamp is present')
                })
            });

            describe('failure', () => {
                it('rejects invalid order ids', async () => {
                    const invalidOrderid = 9999999;
                    await exchange.fillOrder(invalidOrderid, { from: feeAccount}).should.be.rejectedWith(EVM_REVERT);
                })
                it('rejects already fill in orders', async () => {
                    await exchange.fillOrder('1', { from: feeAccount}).should.be.fulfilled;
                    await exchange.fillOrder('1', { from: feeAccount}).should.be.rejectedWith(EVM_REVERT);
                })
                it('rejects cancelled orders', async () => {
                    
                    await exchange.cancelOrder('1', { from: user1}).should.be.fulfilled;

                    await exchange.cancelOrder('1', { from: feeAccount}).should.be.rejectedWith(EVM_REVERT);
                })
            });
        });

        describe('cancelling orders', () => {
            let result;
            describe('success', () => {
                beforeEach(async () => {
                    result = await exchange.cancelOrder('1', { from: user1})
                })
    
                it('updates cancelled orders', async () => {
                    const orderCancelled = await exchange.orderCancelled(1)
                    orderCancelled.should.eq(true)
                })
    
                it('emits a "Cancel" event', () => {
                    const log = result.logs[0];
                    log.event.should.eq('Cancel');
                    const event = log.args;
                    event.id.toString().should.eq('1', 'id is correct')
                    event.user.should.eq(user1, 'user is correct')
                    event.tokenGet.should.eq(token.address, 'tokenGet is correct')
                    event.amountGet.toString().should.eq(tokenFunc(1).toString(), 'amountGet is correct')
                    event.tokenGive.should.eq(INVALID_ADDRESS, 'tokenGive is correct')
                    event.amountGive.toString().should.eq(etherFunc(1).toString(), 'amountGive is correct')
                    event.timestamp.toString().length.should.be.at.least(1, 'timestamp is present')
                })
            });
        });
    });

})
