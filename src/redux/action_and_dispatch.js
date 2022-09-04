import { ethers } from "ethers";
import UZR_ABI from "../abi/Token.json"
import config from "../config.json";

async function loadAccount(dispatch) {
    /*
        window: Globally available object to JavaScript
        inside the browsers.
    */

    /*
        Step-01: MetaMask exposes its API at window.ethereum. We can
        use this API and ask MetaMask to fetch the info about
        the current user.

        MetaMask automatically detects what blockchain this user
        is connected to, requests the data from the blockchain
        and, finally, presents it to us in the console.
    */
    
    let account = await window.ethereum.request({ method: "eth_requestAccounts" });
    
    dispatch({
        type: "ACCOUNT_LOADED", 
        account: account
    });

    return account;
}

function loadProvider(dispatch) {
    /*
        Connect to the blockchain using the provider of ethers.js.
        Now, we are using ethers.js to connect front-end of the app
        to the back-end.
    */
    
    let connection = new ethers.providers.Web3Provider(window.ethereum);
    
    dispatch({
        type: "PROVIDER_LOADED", 
        connection: connection
    });
    
    return connection;
}

async function loadNetwork(provider, dispatch) {
    /*
        Using the provider that we just loaded, now we read
        information from the blockchain. This is the confirmation
        that we are actually connected to the blockchian.
    */
    
    let network = await provider.getNetwork();
    let chainId = network.chainId;
    
    dispatch({
        type: "NETWORK_LOADED", 
        chainId: chainId
    });

    return chainId;
}

async function loadToken(chainID, provider, dispatch) {
    /*
        Connect to the specific smart contract (our CC)
        on that blockchain and read its symbol as a signal of
        confirmation of connection.
    */
    
    let UZR_ADDRESS = config[chainID].UZR.address;
    let UZR = new ethers.Contract(UZR_ADDRESS, UZR_ABI, provider); // Connect to the token deployed on the blockchain
    let symbol = await UZR.symbol(); 

    dispatch({
        type: "TOKEN_LOADED", 
        contract: UZR,
        symbol: symbol
    });
}

export {
    loadProvider, 
    loadNetwork,
    loadAccount,
    loadToken
};
