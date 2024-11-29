import Web3 from "web3";
import { web3Loeaded } from "./actions";

export async function loadWeb3(dispatch) {

    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545")

    dispatch(web3Loeaded(web3))

    return web3;
}