const { tokenFunc, EVM_REVERT, INVALID_ADDRESS } = require('./helpers');

const Token = artifacts.require('./Token');

require('chai')
    .use(require('chai-as-promised'))
    .should()


contract('Token', ([deployer, receiver, spender]) => {   // ⚡ From Accounts array i took users with my suitable name. It could be a b c or whatever. Without this, i’d need to remember which specific index in the array represents each role (like, accounts[0], accounts[1]). 

    let token;
    const name = "Tej Token";
    const symbol = "Tejgaon College";
    const decimals = "18";
    // const totalSupply =  "1000000000000000000000000";   >>>>>>>>>>>>>>>> WE ARE PUTTING 100 MILLION TOKEN IN FORMS OF WEI >>>>>>>>>>>>>>>>
    const totalSupply = tokenFunc(1000000).toString();

    beforeEach(async () => {                           // "beforeEach" should always under "describe". But its also allowed. 
        token = await Token.new()
    })
 
    describe('deployment', () => {
        it('tracks the name', async () => {
            const result = await token.name();
            result.should.equal(name);
        })
        it('tracks the symbol', async () => {
            const result = await token.symbol();
            result.should.equal(symbol);
        })
        it('tracks the decimals', async () => {
            const result = await token.decimals();
            result.toString().should.equal(decimals);
        })
        it('tracks the total supply', async () => {
            const result = await token.totalSupply();
            result.toString().should.equal(totalSupply.toString());
        })
        it('tracks if set the balance of the deployer is right or wrong', async () => {
            const result = await token.balanceOf(deployer);
            result.toString().should.equal(totalSupply.toString());
        })
    });

    describe('sending tokens', () => {                       // >>>>>>>>>>>>>>>>>>>>> TOKEN IS LIKE MONEY !!! >>>>>>>>>>>>>>>>>>>>>>>>>>>>
        let amount
        let result

        describe('success', async () => {
            beforeEach(async () => {
                amount = tokenFunc(100);
                // 🚩 Transfer
                result = await token.transfer(receiver, amount, { from: deployer })   // 👉 Paramiter was 2. But sending 3. The 3rd one is the Meta data where we can add additional info. It is possible because of the web3.js.
            })


            it('tranfer tokens', async () => {
                let balanceOf;

                // 🚩 After transfer
                balanceOf = await token.balanceOf(deployer);
                balanceOf.toString().should.equal(tokenFunc(999900).toString())
                balanceOf = await token.balanceOf(receiver);
                balanceOf.toString().should.equal(tokenFunc(100).toString())
            })

            it('emits a transfer event', async () => {
                const log = result.logs[0];
                log.event.should.eq('Transfer');
                const event = log.args;
                event.from.toString().should.eq(deployer, 'from is correct')
                event._to.toString().should.eq(receiver, 'receiver is correct')
                event._value.toString().should.eq(amount.toString(), 'value is correct')  // eq is the short form of equal.
            })
        })


        describe('failure', async () => {
            it('rejects insufficient balances', async () => {

                let invalidAmount = tokenFunc(1000000000); // Greater than total supply
                await token.transfer(receiver, invalidAmount, { from: deployer }).should.be.rejectedWith(EVM_REVERT);

                invalidAmount = tokenFunc(1);
                await token.transfer(deployer, invalidAmount, { from: receiver }).should.be.rejectedWith(EVM_REVERT);
            });

            it('tracks valid receipent', async () => {
                await token.transfer(INVALID_ADDRESS, amount, { from: deployer }).should.be.rejectedWith(EVM_REVERT);
            });
        })

    });

    describe('approving tokens', () => {
        let result;
        let amount;

        beforeEach(async () => {
            amount = tokenFunc(100);
            result = await token.approve(spender, amount, { from: deployer }); // Allowing the ammounts of tokens 'you' can transmit. I will hold this. 
        })

        describe('success', () => {
            it('allocates on allowance for delegated token spending on exchange', async () => {
                const allowance = await token.allowance(deployer, spender)
                allowance.toString().should.eq(amount.toString());  // Now, i wll allow you if your transact money matched the pervious. 
            })
            it('emits a approval event', async () => {
                const log = result.logs[0];
                log.event.should.eq('Approval');
                const event = log.args;
                event.owner.toString().should.eq(deployer, 'owner is correct')
                event._spender.toString().should.eq(spender, '_spender is correct')
                event._value.toString().should.eq(amount.toString(), 'value is correct')
            })

        })
        describe('failure', () => {
            it('rejects invalid spenders', async () => {
                await token.approve(INVALID_ADDRESS, amount, { from: deployer }).should.be.rejected;
            })
        })

    });

})

