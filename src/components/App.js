import { useEffect } from "react";
import '../App.css';

function App() {

    async function loadBlockchainData () {
        let hardhatAccounts = await window.ethereum.request({ method: "eth_requestAccounts"});
        console.log("Hardhat - Account 0:", hardhatAccounts[0]);
    }

    useEffect(() => {
        loadBlockchainData();
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
