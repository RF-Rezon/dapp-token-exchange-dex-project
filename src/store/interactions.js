import Web3 from "web3";
import Exchange from '../abis/Exchange.json';
import Token from "../abis/Token.json";
import { web3AccountLoaded, web3IdLoaded, web3Loaded, web3TokenLoaded, web3ExchangeLoaded } from "./actions";


export async function loadWeb3(dispatch) {

    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545")

    dispatch(web3Loaded(web3))

    return web3;
}

export async function loadAccount(web3, dispatch) {

    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    dispatch(web3AccountLoaded(account))

    return account;
}

export async function loadId(web3, dispatch) {

    const id = await web3.eth.net.getId();

    dispatch(web3IdLoaded(id))

    return id;
}

export async function loadToken(web3, networkId, dispatch) {

    const tokenABI = Token.abi;
    const tokenAddress = await Token.networks[networkId]?.address;
    if (!tokenAddress) {
      alert("Token contract not deployed to this network.");
      return null;
    }

    const token = await new web3.eth.Contract(tokenABI, tokenAddress);
    dispatch(web3TokenLoaded(token))
    return token;
}

export async function loadExchange(web3, networkId, dispatch) {

    const exchangeABI = Exchange.abi;
    const exchangeAddress = await Exchange.networks[networkId]?.address;
    if (!exchangeAddress) {
      alert("Exchange contract not deployed to this network.");
      return null;
    }

    const exchange = await new web3.eth.Contract(exchangeABI, exchangeAddress);
    dispatch(web3ExchangeLoaded(exchange))
    return exchange;
}