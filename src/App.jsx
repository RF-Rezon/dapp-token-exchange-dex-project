import { useEffect, useState } from "react";
import Web3 from "web3";
import Token from './abis/Token';

function App() {
  const [totalSupply, setTotalSupply] = useState(null); // State for total supply
  const [networkType, setNetworkType] = useState(""); // State for network type

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        // Initialize web3 instance
        const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");

        // Get the network ID
        let networkId = await web3.eth.net.getId();
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

        // Example: Check for a token contract (you need its ABI and address)
        const tokenABI = Token.abi; // Replace with your contract's ABI
        const tokenAddress = Token.networks[networkId].address; // Replace with your contract address
        console.log(tokenAddress)

        const tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);

        // Example: Fetch total supply from the token contract
        const supply = await tokenContract.methods.totalSupply().call();

        // Convert BigInt to a string before setting state
        setTotalSupply(supply.toString());
        console.log("Total Supply:", supply.toString());
      } catch (error) {
        console.error("Error loading blockchain data:", error);
      }
    };

    loadBlockchainData();
  }, []);

  return (
    <div>
      <h1>Blockchain Data</h1>
      <p>Network Type: {networkType || "Loading..."}</p>
      <p>Total Supply: {totalSupply || "Loading..."}</p>
    </div>
  );
}

export default App;
