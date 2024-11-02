const { send } = require('vite');

const Token = artifacts.require('./Token');

require('chai')
.use(require('chai-as-promised'))
.should()

contract('Token', ([deployer, reciver]) => {   // ⚡ From Accounts array i took users with my suitable name. It could be a b c or whatever. Without this, i’d need to remember which specific index in the array represents each role (like, accounts[0], accounts[1]). 

    let token; 
    const name = "Tej Token"; 
    const symbol = "Tejgaon College";
    const decimals = "18";
    const totalSupply =  "1000000000000000000000000";

    beforeEach( async () => {
     token = await Token.new()
    }) 

    describe('deployment', () => {
        it('tracks the name', async () => {
            
        const result = await token.name();
        result.should.equal(name);
        });
        it('tracks the symbol', async () => {
            const result = await token.symbol();
            result.should.equal(symbol);
        });
        it('tracks the decimals', async () => {
            const result = await token.decimals();
            result.toString().should.equal(decimals);
        });
        it('tracks the total supply', async () => {
            const result = await token.totalSupply();
            result.toString().should.equal(totalSupply);
        });
        it('tracks if set the balance of the deployer is right or wrong', async () => {
            const result = await token.balanceOf(deployer);
            result.toString().should.equal(totalSupply);
        });
    });

    describe('sending tokens', ()=> {
        it('tranfer tokens', async ()=>{
            let totalNumberOfTokens;    // 🔴 balanceOf
            // 🚩 Before transfer
            totalNumberOfTokens = await token.balanceOf(reciver);
            console.log("Receiver token ammounts before transfer", totalNumberOfTokens.toString())
            totalNumberOfTokens = await token.balanceOf(deployer);
            console.log("Deployer token ammounts transfer", totalNumberOfTokens.toString())
            // 🚩 Transfer
            await token.transfer(reciver, '1000000000000000000000000' , {from: deployer}) // 👉 Paramiter was 2. But sending 3. The 3rd one is the Meta data where we can add additional info. It is possible because of the web3.js.
             
            // 🚩 After transfer
            totalNumberOfTokens = await token.balanceOf(reciver);
            console.log("Receiver token ammounts transfer", totalNumberOfTokens.toString())
            totalNumberOfTokens = await token.balanceOf(deployer);
            console.log("Deployer token ammounts transfer", totalNumberOfTokens.toString())
        })

    })
});

