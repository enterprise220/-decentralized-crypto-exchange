import logo from "../assets/img/logo.svg";
import { useSelector } from "react-redux";
import { loadBalances } from "../redux/action_and_dispatch.js";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { transferTokens } from "../redux/action_and_dispatch.js";

const Balance = () => {
  const [token1ExchangeBalance, setToken1ExchangeBalance] = useState(0);
  const dispatch = useDispatch();
  
  let symbols = useSelector((state) => {
    return state.CC.symbols;
  });

  let contracts = useSelector((state) => {
    return state.CC.contracts;
  });

  let exchange = useSelector((state) => {
    return state.exchange.exchange;
  });

  let account = useSelector((state) => {
    return state.provider.account;
  });

  let provider = useSelector((state) => {
    return state.provider.connection;
  });

  let cryptoCurrencyBalance = useSelector((state) => {
    return state.CC.balances;
  });

  let exchangeDeposittedBalance = useSelector((state) => {
    return state.exchange.balances;
  });

  const amountHandler = (e, token) => {
    if (token.address === contracts[0].address) {
      setToken1ExchangeBalance(e.target.value);
    }
  }

  const depositHandler = (e, token) => {
    e.preventDefault();
        
    if (token.address === contracts[0].address) {
      transferTokens("deposit", token, exchange, provider, token1ExchangeBalance, dispatch);
    }
  }

  useEffect(() => {
    if (exchange && account && contracts[0] && contracts[1]) {
      loadBalances(contracts, exchange, account, dispatch);
    }
  }, [exchange, contracts, account, dispatch]);

  return(
    <div className="component exchange__transfers">
      <div className="component__header flex-between">
        <h2>Balance</h2>
        <div className="tabs">
          <button className="tab tab--active">Deposit</button>
          <button className="tab">Withdraw</button>
        </div>
      </div>

      {/* Deposit/Withdraw Component 1 (DApp) */}

      <div className="exchange__transfers--form">
        <div className="flex-between">
          <p>
            <small> Token </small>
            <br />
            <img src = { logo } width = { 23 } alt = "Token Logo" />
            { symbols ? symbols[0] : "" }
          </p>
          <p>
            <small> Wallet </small>
            <br />
            { cryptoCurrencyBalance ? cryptoCurrencyBalance[0] : "" }
          </p>
          <p>
            <small> Exchange </small>
            <br />
            { exchangeDeposittedBalance ? exchangeDeposittedBalance[0] : "" }
          </p>
        </div>

        <form autoComplete = "off" onSubmit = { (e) => { depositHandler(e, contracts[0]) } }>
          <label htmlFor="token0"><small> Deposit { symbols ? symbols[0] : "" } Amount </small></label>
          <input type="text" id="token0" placeholder="0.000" onChange = { (e) => { amountHandler(e, contracts[0]) } }/>

          <button className="button" type="submit">
            <span> Deposit </span>
          </button>
        </form>
      </div>

      <hr />

      {/* Deposit/Withdraw Component 2 (mETH) */}

      <div className="exchange__transfers--form">
        <div className="flex-between"></div>

        <form autoComplete = "off">
          <label htmlFor="token1"></label>
          <input type="text" id="token1" placeholder="0.000" />

          <button className="button" type="submit">
            <span></span>
          </button>
        </form>
      </div>

      <hr />
    </div>
  );
};

export default Balance;
