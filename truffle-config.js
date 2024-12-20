module.exports = {

  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    }
  },
  // // Configure directories
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.13",      // Fetch exact version from solc-bin
    }
  }
};
