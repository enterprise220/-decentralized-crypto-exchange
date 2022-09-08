import logo from "../assets/img/logo.svg";
import { useDispatch, useSelector } from "react-redux";
import truncateEthAddress from 'truncate-eth-address';
import Blockies from "react-blockies";
import { loadAccount } from "../redux/action_and_dispatch.js";
import selectorIcon from "../assets/img/eth.svg";
import config from "../config.json";

function NavBar() {
    const dispatch = useDispatch();

    let account = useSelector((state) => {
        return state.provider.account;
    });
    
    let balance = useSelector((state) => {
        return state.provider.balance;
    });
    
    let provider = useSelector((state) => {
        return state.provider.connection;
    });
    
    let chainID = useSelector((state) => {
        return state.provider.chainId;
    });

    async function connect() {
        /*
            Connect MetaMask with blockchain and 
            load user account address and balance
            if they click on the "Connect" button
        */

        await loadAccount(dispatch, provider);
    }
    
    async function changeNetwork(e) {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{
                chainId: e.target.value 
            }]
        });
    }
    
    return(
        <div className = 'exchange__header grid'>
          <div className = 'exchange__header--brand flex'>
            <img className = "logo" src = { logo } alt = "DEX Logo"/>
            <h1> Decentralized Crypto Exchange ( DEX ) </h1>
          </div>
   
          
          <div className = 'exchange__header--networks flex'>
          <img src = { selectorIcon } alt = "Networks selector icon" />
          { chainID &&
            
            <select name = "networks" id = "networks" value = { config[chainID] ? `0x${ chainID.toString(16) }` : "0" } onChange = { changeNetwork }>
                <option value = "0" disabled> Select Netowrk </option>
                <option value = "0x7A69"> Localhost </option>
                <option value = "0x2a"> Kovan </option>
            </select> }
          </div>
    
        
          <div className = 'exchange__header--account flex'>
          <p> <small> My Balance: </small> { balance? Number(balance).toFixed(4): "?" } ETH </p>
            
          { account
            ?
            <a href = { config[chainID] ? `${config[chainID].explorerURL }/address/${ account }` : "#"} target = "_blank" rel = "noreferrer"> { truncateEthAddress(account) }
            <Blockies
                seed = { account }
                size = { 10 }
                scale = { 3 }
                color = "#dfe"
                bgColor = "#ffe"
                spotColor = "#abc"
                className = "identicon"
            />
            </a>
            :
            <button className = "button" onClick = { connect }> Connect </button> }
          </div>
        </div>
    )
}

export default NavBar;
