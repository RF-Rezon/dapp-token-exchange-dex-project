export function web3Loaded(connection) {
    return {
        type: 'WEB3_LOADED',
        connection
    }
}
export function web3AccountLoaded(account) {
    return {
        type: 'WEB3_ACCOUNT_LOADED',
        account
    }
}
export function web3IdLoaded(id) {
    return {
        type: 'WEB3_ID_LOADED',
        id
    }
}
export function web3TokenLoaded(contract) {
    return {
        type: 'WEB3_TOKEN_LOADED',
        contract
    }
}
export function web3ExchangeLoaded(contract) {
    return {
        type: 'WEB3_EXCHANGE_LOADED',
        contract
    }
}