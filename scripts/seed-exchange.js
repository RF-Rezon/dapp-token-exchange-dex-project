const Token = artifacts.require("Token");
const Exchange = artifacts.require("Exchange");

function tokenFunc (params) {
    let wei = web3.utils.toWei(params.toString(), 'ether');
    return wei;
    }

    function etherFunc (params) {
       return tokenFunc(params);
    }

const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';
    

const wait = (seconds) => {
    const milliseconds = seconds * 1000;
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

module.exports = async function(callback) {
    try{
        // Fetch accounts from wallet - these are unlocked
        const accounts = await web3.eth.getAccounts();

        // Fetch the deployed token
        const token = await Token.deployed();
        console.log('Token fetched', token.address);

        // Fetch the deployed exchange
        const exchange = await Exchange.deployed();
        console.log('Exchange fetched', exchange.address);

        // Give tokens to account[1]
        const sender = accounts[0];
        const receiver = accounts[1];
        let amount = web3.utils.toWei('10000', 'ether'); // 10.000 tokens

        await token.transfer(receiver, amount, {from: sender});
        console.log(`Transferred ${amount} tokens from ${sender} to ${receiver}`);

        // Setup users
        const user1 = accounts[0];
        const user2 = accounts[1];

        // User 1 deposits Ether
        amount = 1;
        await exchange.depositEther({from: user1, value: etherFunc(amount)});
        console.log(`Deposited ${amount} Ether from ${user1}`);

        // User 2 approves tokens
        amount = 10000;
        await token.approve(exchange.address, tokenFunc(amount), {from: user2});
        console.log(`Approved ${amount} tokens from ${user2}`);

        // User2 deposits tokens
        await exchange.depositToken(token.address, tokenFunc(amount), {from: user2});
        console.log(`Deposited ${amount} tokens from ${user2}`);

        //////////////////////////////
        // Seed a cancelled order   //
        //////////////////////////////

        // User 1 makes order to get tokens
        let result;
        let orderId
        result = await exchange.makeOrder(token.address, tokenFunc(100), ETHER_ADDRESS, etherFunc(0.1), {from: user1});
        console.log(`Made order from ${user1}`);

        // User 1 cancels order
        orderId = result.logs[0].args.id;
        await exchange.cancelOrder(orderId, {from: user1});
        console.log(`Cancelled order from ${user1}`);

        //////////////////////////////
        // Seed filled orders       //
        //////////////////////////////

        // User 1 makes order
        result = await exchange.makeOrder(token.address, tokenFunc(100), ETHER_ADDRESS, etherFunc(0.1), {from: user1});
        console.log(`Made order from ${user1}`);

        // User 2 fills order
        orderId = result.logs[0].args.id;
        await exchange.fillOrder(orderId, {from: user2});
        console.log(`${user2} filled order from ${user1}`);

        // Wait 1 second
        await wait(1);

        // User 1 makes another order
        result = await exchange.makeOrder(token.address, tokenFunc(50), ETHER_ADDRESS, etherFunc(0.01), {from: user1});
        console.log(`Made order from ${user1}`);

        // User 2 fills another order
        orderId = result.logs[0].args.id;
        await exchange.fillOrder(orderId, {from: user2});
        console.log(`${user2} filled order from ${user1}`);

        // Wait 1 second
        await wait(1);
        
        // User 1 makes final order
        result = await exchange.makeOrder(token.address, tokenFunc(200), ETHER_ADDRESS, etherFunc(0.15), {from: user1});
        console.log(`Made order from ${user1}`);

        // User 2 fills final order
        orderId = result.logs[0].args.id;
        await exchange.fillOrder(orderId, {from: user2});
        console.log(`${user2} filled order from ${user1}`);

        // Wait 1 second
        await wait(1);

        //////////////////////////////
        // Seed open   orders       //
        //////////////////////////////

        // User 1 makes 10 orders
        for(let i = 1; i <= 10; i++) {
            result = await exchange.makeOrder(token.address, tokenFunc(10 * i), ETHER_ADDRESS, etherFunc(0.01), {from: user1});
            console.log(`Made order from ${user1}`);
            // Wait 1 second
            await wait(1);            
        }

        // User 2 makes 10 orders
        for(let i = 1; i <= 10; i += 1) {
            result = await exchange.makeOrder(ETHER_ADDRESS, etherFunc(0.01), token.address, tokenFunc(10 * i), {from: user2});
            console.log(`Made order from ${user2}`);
            // Wait 1 second
            await wait(1);            
        }        
    }
    catch(error) {
        console.log(error);
    }
    callback();
}