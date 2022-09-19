import logo from "../assets/img/logo.svg";
import { useSelector } from "react-redux";
import { loadBalances } from "../redux/action_and_dispatch.js"
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const Balance = () => {
    let symbols = useSelector((state) => {
        return(state.CC.symbols);
    });

    let contracts = useSelector((state) => {
        return(state.CC.contracts);
    });
    
    let exchange = useSelector((state) => {
        return(state.exchange.exchange);
    });
    
    let account = useSelector((state) => {
        return(state.provider.account);
    });

    let dispatch = useDispatch();

    useEffect(() => {
        if (exchange && account && contracts[0] && contracts[1]) {
            loadBalances(contracts, exchange, account, dispatch);
        }
    }, [exchange, contracts, account, dispatch]);
    
    return (
      <div className='component exchange__transfers'>
        <div className='component__header flex-between'>
          <h2>Balance</h2>
          <div className='tabs'>
            <button className='tab tab--active'>Deposit</button>
            <button className='tab'>Withdraw</button>
          </div>
        </div>
  
        {/* Deposit/Withdraw Component 1 (DApp) */}
  
        <div className='exchange__transfers--form'>
          <div className='flex-between'>
            <p>
                <small> Token </small>
                <br />
                <img src = { logo } width = { 23 } alt = "Token Logo" />
                { symbols ? symbols[0] : ""}
            </p>
          </div>
  
          <form>
            <label htmlFor="token0"></label>
            <input type="text" id='token0' placeholder='0.0000' />
  
            <button className='button' type='submit'>
              <span></span>
            </button>
          </form>
        </div>
  
        <hr />
  
        {/* Deposit/Withdraw Component 2 (mETH) */}
  
        <div className='exchange__transfers--form'>
          <div className='flex-between'>
  
          </div>
  
          <form>
            <label htmlFor="token1"></label>
            <input type="text" id='token1' placeholder='0.0000'/>
  
            <button className='button' type='submit'>
              <span></span>
            </button>
          </form>
        </div>
  
        <hr />
      </div>
    );
  }
  
  export default Balance;