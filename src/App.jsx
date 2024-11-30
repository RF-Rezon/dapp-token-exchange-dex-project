import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAccount, loadExchange, loadId, loadToken, loadWeb3 } from "./store/interactions";

function App() {
  const [totalSupply, setTotalSupply] = useState(null); // State for total supply
  const [account, setAccount] = useState(""); // State for user's account
  const dispatch = useDispatch();

  // Access Web3 from Redux state
  useSelector((state) => state.web3.connection);

  useEffect(() => {
    const initializeBlockchainData = async () => {
      try {
        // Load Web3 and store it in Redux
        const web3Instance = await loadWeb3(dispatch);

        // Get accounts
        const account = await loadAccount(web3Instance, dispatch)
        setAccount(account); // Set the first account

        // Get the network ID
        const networkId = await loadId(web3Instance, dispatch)
        console.log("Network ID:", networkId);

        // // Map the network ID to a network name
        // const networkMapping = {
        //   1: "mainnet",
        //   3: "ropsten",
        //   4: "rinkeby",
        //   5: "goerli",
        //   42: "kovan",
        //   5777: "ganache", // Added for Ganache
        // };
        // const networkName = networkMapping[networkId] || "unknown/private";
        // setNetworkType(networkName);
        // console.log("Network Type:", networkName);

        // Access the token contract
       

        const tokenContract = await loadToken(web3Instance, networkId, dispatch);
        await loadExchange(web3Instance, networkId, dispatch);

        // Fetch total supply from the token contract
        const supply = await tokenContract.methods.totalSupply().call();
        setTotalSupply(supply.toString());
        console.log("Total Supply:", supply.toString());
      } catch (error) {
        console.error("Error loading blockchain data:", error);
      }
    };

    initializeBlockchainData();
  }, [dispatch]); // Ensure it runs only once when the component mounts

  return (
    <div>
      <h1>Blockchain Data</h1>
      <p><strong>Account:</strong> {account || "Not connected"}</p>
      <p><strong>Total Supply:</strong> {totalSupply || "Loading..."}</p>
    </div>
  );
}

export default App;
