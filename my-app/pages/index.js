import {Contract, providers, utils} from "ethers";
import Head from "next/head";
import Link from "next/link";
import Web3modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {abi, NFT_CONTRACT_ADDRESS } from "../constants";
import styles from "../styles/Home.module.css";
import navStyles from '../styles/Navbar.module.css'
import { RiMenu3Line, RiCloseLine } from "react-icons/ri"