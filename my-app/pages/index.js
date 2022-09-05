import { Contract, providers, utils } from "ethers";
import Head from "next/head";
import Link from 'next/link'
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { abi, NFT_CONTRACT_ADDRESS } from "../constants";
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

  // check if sale is paused

  const checkIfsetPaused = async() =>{
    try{
      const signer = await getProviderOrSigner(true);
      const citaContract = new Contract(
        NFT_CONTRACT_ADDRESS,
        abi,
        signer
      );
      const setPaused = await citaContract.setPaused();
      setPaused(true);
    }catch (err){
      console.error(err);
    }
  }


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

  const getProviderOrSigner = async(needSigner = false) =>{
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


    // use effect


     useEffect(() => {
      // if wallwt is not connected, create an instance to connect
      if (!walletConnected){
        web3ModalRef.current = new Web3Modal({
          network: "Goerli",
          providerOptions,
          CacheProvider: false,
          disableInjectedProvider: false,

        });

        //  // Check if presale has started and if sale is not paused
        //   const presaleStarted = checkIfpresaleStarted();
        //   if (presaleStarted) {
        //     checkIfsetPaused();
        //   }

        //   // get tokensId minted

        //   getTokenIdsMinted()

        //   // to check num of tokens minted every 3 sec

        //   setInterval(async function(){
        //     await getTokenIdsMinted();
        //   }, 3 * 1000 );
      }
     }, [walletConnected]);



      // button to connect and disconnect wallet for user 

     const renderMenuButton = () => {
      if(!walletConnected){
        return (
          <div className={navStyles.navbar_menu_container_button}>
          <button onClick={connectWallet}>Connect Wallet</button>
        </div>
        )
      } 
      if(walletConnected) {
        return(
          <div className={navStyles.navbar_menu_container_button}>
            <button onClick={onDisconnect}>Disconnect</button>
          </div>
        )
      }
    }

    // button admin to connect wallet, also if contract owner can start presale if not started

    const renderButton = () =>{
      if(!walletConnected){
        return (
          <div className={navStyles.navbar_button}>
          <button onClick={connectWallet}>Connect Wallet</button>
        </div>
        )
      } 
      
        if ( isOwner && !presaleStarted){
          return(
            <div className={navStyles.navbar_button}>
              <button onClick={startPresale}>Start Sale</button>
            </div>
          )
        }
    
    
      else if(walletConnected) {
      
        return(
          <div className={navStyles.navbar_button}>
            <button onClick={onDisconnect}>Disconnect</button>
          </div>
        )
      }
      
    }
    
    
    //  mint button 
    
      const renderMint = () => {
        if(walletConnected){
          if (walletConnected){
            return (<button onClick={mint}>Mint Cita</button>)
          }else if(loading){
            return (<button>Loading...</button>)
          }else if(tokenIdsMinted >= 333){
            return <h3>Supply sold out</h3>
          }else{
            return(<h3>Wait for sale to start</h3>)
          }
        }else{
          return (<h3>Connect your wallet to Mint</h3>)
        }
      }



      // frontend interface 



      return (
        <div className={styles.container}>
          <Head>
            <title>Cita Nft</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
      
          <div className={navStyles.navContainer}>
            <div className={navStyles.navbar}>
              <div className={navStyles.navbar_links}>
                  <div className={navStyles.navbar_links_logo}>
                      <Link href="/" passHref><h1> CITA NFT</h1></Link>
                  </div>
                  <div className={navStyles.navbar_links_container}>
                    <a href="#Mint"><p>Mint CT</p></a>
                    <p>Opensea</p>
                    <p>About</p>
                    <a href='https://github.com/innbuld'><p>GitHub</p></a>
                  </div>
              </div>
              {renderButton()}
              <div className={navStyles.navbar_menu}>
                {toggleMenu 
                ? <RiCloseLine color="#fff" size={26} onClick ={() => (setToggleMenu(false))}/>
                : <RiMenu3Line color="#fff" size={26} onClick ={() => (setToggleMenu(true))}/>
                }
      
                {toggleMenu && (
                  <div className={navStyles.navbar_menu_container}>
                    <div className={navStyles.navbar_menu_links}>
                        <>
                        <a href="#Mint"><p>Mint CT</p></a>
                          <p>Opensea</p>
                          <p>About</p>
                          <a href='https://github.com/innbuld'><p>GitHub</p></a>
                        </>
                        {renderMenuButton()}
                    </div>
                  </div>
                )}
              </div>
          </div>
        </div>
      
          <div className={styles.main} id="home">
            <div className={styles.main_content}>
                <h1 className={styles.main_text}>Join the Cita NFT Mint today !</h1>
                  
                <p>Cita Nft is a collection of free 333 epic NFT's, which provides access to the Cita Dao community, a total supply of 333 would be given out for free FCFS</p>
              <div className={styles.mint_button}>
                 
                <p>Scroll Down To Mint Your CT Nft And Be Part Of The Community</p>
              </div>
            </div>
            <div className={styles.mainImage}>
                <img src='./ddd.svg' alt="main image"></img> 
              </div>
          </div>
      
          <div className={styles.mintpage} id="Mint">
            <div className={styles.mintPage_content}>
              <h1> Below Is The Mint Button To Mint Your free Cita Nft,FcFS 333 supply available</h1>
      
              {renderMint()}
              <h3>{tokenIdsMinted}/333 Minted</h3>
            </div>
          </div>
          <footer className={styles.footer}>
            @2022 Made by Abdulmuizz. All rights reserved.
            </footer>
          
        </div>
      )
      







  
}