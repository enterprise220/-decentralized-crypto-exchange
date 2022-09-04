import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadProvider, loadNetwork, loadAccount, loadToken } from "../redux/action_and_dispatch.js";

function App() {
    const dispatch = useDispatch();
    
    async function load() {
        let account = await loadAccount(dispatch); 
        let provider = loadProvider(dispatch);
        let chainID = await loadNetwork(provider, dispatch);
        let UZR = await loadToken(chainID, provider, dispatch);
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
