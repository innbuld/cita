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






















































  
}