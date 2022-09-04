import {Contract, providers, utils} from "ethers";
import Head from "next/head";
import Link from "next/link";
import Web3modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {abi, NFT_CONTRACT_ADDRESS } from "../constants";
import styles from "../styles/Home.module.css";
import navStyles from '../styles/Navbar.module.css'
import { RiMenu3Line, RiCloseLine } from "react-icons/ri"

export default function Home() {
  const [toggleMenu, setToggleMenu] = useState(false)
  // walletConnected keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  // presaleStarted keeps track of whether the presale has started or not
  const [presaleStarted, setPresaleStarted] = useState(false);
  // loading is set to true when we are waiting for a transaction to get mined
  const [loading, setLoading] = useState(false);
  // checks if the currently connected MetaMask wallet is the owner of the contract
  const [isOwner, setIsOwner] = useState(false);
  // tokenIdsMinted keeps track of the number of tokenIds that have been minted
  const [tokenIdsMinted, setTokenIdsMinted] = useState("0");
  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3ModalRef = useRef();


  // const mint 

  const mint = async () =>{
    try{
      //need a signer to write the txn
      const signer = await getProviderOrSigner(true);
       // Create a new instance of the Contract with a Signer, which allows
        // update methods
        const citaContract = new Contract(
          NFT_CONTRACT_ADDRESS,
          abi,
          signer
        );
        // call the mint function to mint nft to user 
        const tx = await citaContract.mint({
          //value parsing showing price of nft
          value:utils.parseEther("0.00"),
        });
        setLoading(true);
        // waiting for txn to be executed
        await tx.wait();
        setLoading(false);
        window.alert("You minted a cita Nft Successfully");
    }catch (err){
      console.error(err);
    }
  };

  // connect wallet

  const connectWallet = async() =>{
    try{
      //using web3modal , metamask
      // when used for the first time , a prompt to connect wallet will pop
      const signer = await getProviderOrSigner(true);
      // to set wallet connected is true 
      setWalletConnected(true)
    }catch (err){
      console.error(err);
    }

  };


  // check if presale is started

  const checkIfpresaleStarted = async() =>{
    try{
      //signer to write txn
      const signer = await getProviderOrSigner(true);
     // Create a new instance of the Contract with a Signer, which allows
        // update methods
        const citaContract = new Contract(
          NFT_CONTRACT_ADDRESS,
          abi,
          signer
        );
        // to call the presaleStarted function 
        const presaleStarted = await citaContract.presaleStarted();
        if (!presaleStarted){
          await getOwner();
        }
        setPresaleStarted(presaleStarted);  
        return presaleStarted;
    }catch (err){
      console.error(err);
      return(false);
    }
    
  }


  // to start presale of the nft

  const startPresale = async() =>{
    try{
      // signer to write the txn
      const signer = await getProviderOrSigner(true);
      // Create a new instance of the Contract with a Signer, which allows
        // update methods
        const citaContract = new Contract(
          NFT_CONTRACT_ADDRESS,
          abi,
          signer
        );
        // to call the start presale function 

        const tx = await citaContract.startPresale();
        setLoading(true);
        // wait for txn to be completed
        await tx.wait();
        setLoading(false);
        // checl startPresale to true
        await checkIfpresaleStarted();
    } catch(err) {
      console.error(err);
    }
  };


  // to get owner of the contract

  const getOwner = async() =>{
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // No need for the Signer here, as we are only reading state from the blockchain
      const provider = await getProviderOrSigner();
      // We connect to the Contract using a Provider, so we will only
      // have read-only access to the Contract
      const citaContract = new Contract(
         NFT_CONTRACT_ADDRESS,
         abi,
         provider
        );
      // call the owner function from the contract
      const _owner = await citaContract.owner();
      // We will get the signer now to extract the address of the currently connected MetaMask account
      const signer = await getProviderOrSigner(true);
      // Get the address associated to the signer which is connected to  MetaMask
      const address = await signer.getAddress();
      if (address.toLowerCase() === _owner.toLowerCase()) {
        setIsOwner(true);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  // get number of nfts minted 

  const getTokenIdsMinted = async() =>{
   try{
     // get the web3modal provider
     const provider = await getProviderOrSigner();
     // connect to the contract
     const citaContract = new Contract(
       NFT_CONTRACT_ADDRESS,
       abi,
       provider
     );
     // call the tokenIds from the contract
     const tokenIds = await citaContract.tokenIds();
     // convert tokenId to string 
     setTokenIdsMinted(tokenIds.toString());
   }catch(err){
    console.error(err);
   }
  };


  // set up a wallet provider option

  const getProviderOrSigner = async() =>{
    // connect to metamsk since web3modal supports metamsk
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider)

    // prompt user to connect to the right network
    const { chainId } = await web3Provider.getNetwork();
   if (chainId !== 5) {
     window.alert("Change the network to Goerli");
     throw new Error("Change network to Goerli");
   }

   if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
     }
     return web3Provider;
    }

    const providerOptions = {
      binancechainwallet: {
        package:true,
      },
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          rpc: {
            5: "https://goerli.infura.io/v3/",
          },
          chainId: 5,
        },
      },
    };


    // on disconnect

    const onDisconnect = async() => {
      try{
        await web3ModalRef.current.clearCachedProvider();
        setWalletConnected(false);
        console.log("Disconnected")
      }catch (err){
        console.error(err);
      }
    };






















































  
}