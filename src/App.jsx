import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Token from "./abis/Token.json";
import { loadWeb3 } from "./store/interactions";

function App() {
  const [totalSupply, setTotalSupply] = useState(null); // State for total supply
  const [networkType, setNetworkType] = useState(""); // State for network type
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
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]); // Set the first account
        console.log("Connected Account:", accounts[0]);

        // Get the network ID
        const networkId = await web3Instance.eth.net.getId();
        console.log("Network ID:", networkId);

        // Map the network ID to a network name
        const networkMapping = {
          1: "mainnet",
          3: "ropsten",
          4: "rinkeby",
          5: "goerli",
          42: "kovan",
          5777: "ganache", // Added for Ganache
        };
        const networkName = networkMapping[networkId] || "unknown/private";
        setNetworkType(networkName);
        console.log("Network Type:", networkName);

        // Access the token contract
        const tokenABI = Token.abi;
        const tokenAddress = Token.networks[networkId]?.address;
        if (!tokenAddress) {
          alert("Token contract not deployed to this network.");
          return;
        }
        console.log("Token Contract Address:", tokenAddress);

        const tokenContract = new web3Instance.eth.Contract(tokenABI, tokenAddress);

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
      <p><strong>Network Type:</strong> {networkType || "Loading..."}</p>
      <p><strong>Total Supply:</strong> {totalSupply || "Loading..."}</p>
    </div>
  );
}

export default App;
