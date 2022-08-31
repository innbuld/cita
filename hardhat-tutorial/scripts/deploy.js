const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
const {  METADATA_URL } = require("../constants");

async function main() {
  
  // URL from where we can extract the metadata for a Crypto Dev NFT
  const metadataURL = METADATA_URL;
 
  const citaContract = await ethers.getContractFactory("CryptoDevs");

  // deploy the contract
  const deployedcitaContract = await citaContract.deploy(
    metadataURL
    
  );

  // print the address of the deployed contract
  console.log(
    "Cita Contract Address:",
    deployedcitaContract.address
  );
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });