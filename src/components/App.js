import { useEffect } from "react";
import { ethers } from "ethers";
import UZR_ABI from "../abi/Token.json"
import config from "../config.json";
import '../App.css';

function App() {    
    async function load() {
        /*
            window: Globally available object to JavaScript
            inside the browsers.
        
            MetaMask exposes its API at window.ethereum. We can
            use this API and ask MetaMask to fetch the info about
            the current user.

            MetaMask automatically detects what blockchain this user
            is connected to, requests the data from the blockchain
            and, finally, presents it to us in the console.
        */
        
        let hardhatAccounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        console.log("MetaMask User Address:", hardhatAccounts);

        /*
            Connect to the blockchain and log the chain ID 
            in the console as confirmation for the connection.
        */
        
        let provider = new ethers.providers.Web3Provider(window.ethereum); // Connect to the blockchain
        let { chainId } = await provider.getNetwork(); // Destructuring chainId from the network object
        console.log("Blockchain Network Chain ID:", chainId);

        /*
            Connect to the specific smart contract (our CC)
            on that blockchain and read its symbol as a signal of
            confirmation of connection.
        */
        
        const UZR_ADDRESS = config[chainId].UZR.address;
        const UZR = new ethers.Contract(UZR_ADDRESS, UZR_ABI, provider); // Connect to the token deployed on the blockchain
        console.log("Token Symbol:", await UZR.symbol());
    }

    useEffect(() => {
        load();
    });

    return (
      <div>
  
        {/* Navbar */}
  
        <main className='exchange grid'>
          <section className='exchange__section--left grid'>
  
            {/* Markets */}
  
            {/* Balance */}
  
            {/* Order */}
  
          </section>
          <section className='exchange__section--right grid'>
  
            {/* PriceChart */}
  
            {/* Transactions */}
  
            {/* Trades */}
  
            {/* OrderBook */}
  
          </section>
        </main>
  
        {/* Alert */}
  
      </div>
    );
}

export default App;
