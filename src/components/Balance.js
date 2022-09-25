import logo from "../assets/img/logo.svg";
import logo2 from "../assets/img/eth.svg";
import { useSelector } from "react-redux";
import { loadBalances } from "../redux/action_and_dispatch.js";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useState, useRef } from "react";
import { transferTokens } from "../redux/action_and_dispatch.js";

const Balance = () => {
  const [ token1ExchangeBalance, setToken1ExchangeBalance ] = useState("0.0000");
  const [ token2ExchangeBalance, setToken2ExchangeBalance ] = useState("0.0000");
  const [ depositWithdrawButton, setDepositWithdrawButton ] = useState("Deposit Funds");
  const depositRef = useRef();
  const withdrawRef = useRef();

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

  let transferInProgress = useSelector((state) => {
    return state.exchange.transferInProgress;
  });

  const amountHandler = (e, token) => {
    if (token.address === contracts[0].address) {
      setToken1ExchangeBalance(e.target.value);
    }
    else {
      setToken2ExchangeBalance(e.target.value);
    }
  }

  const depositHandler = async (e, token) => {
    e.preventDefault();

    if (token.address === contracts[0].address) {
      await transferTokens("deposit", token, exchange, provider, token1ExchangeBalance, dispatch);
      setToken1ExchangeBalance("0.0000");
    }
    else {
      await transferTokens("deposit", token, exchange, provider, token2ExchangeBalance, dispatch);
      setToken2ExchangeBalance("0.0000");
    }
  }

  const switchTab = (e) => {
    if (e.target.className === withdrawRef.current.className) {
      e.target.className = "tab tab--active";
      depositRef.current.className = "tab";
      setDepositWithdrawButton("Withdraw Funds");
    }
    else {
      e.target.className = "tab tab--active";
      withdrawRef.current.className = "tab";
      setDepositWithdrawButton("Deposit Funds");
    }
  }

  useEffect(() => {
    if (exchange && account && contracts[0] && contracts[1]) {
      loadBalances(contracts, exchange, account, dispatch);
    }
  }, [ exchange, contracts, account, dispatch, transferInProgress ]);

  return(
    <div className="component exchange__transfers">
      <div className="component__header flex-between">
        <h2> Balance </h2>
        <div className="tabs">
          <button ref = { depositRef } onClick = { (e) => { switchTab(e) } } className="tab tab--active">Deposit</button>
          <button ref = { withdrawRef } onClick = { (e) => { switchTab(e) } } className="tab"> Withdraw </button>
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

        <form autoComplete = "off" onSubmit = { 
          (e) => { 
            depositHandler(e, contracts[0]) 
          }}
        >
          <label htmlFor="token0"><small> Deposit { symbols ? symbols[0] : "" } Amount </small></label>
          <input type = "text" id = "token0" value = { token1ExchangeBalance } placeholder = "0.0000" onChange = {
            (e) => {
              amountHandler(e, contracts[0]);
            }}
          />

          <button className="button" type="submit">
            <span> { depositWithdrawButton } </span>
          </button>
        </form>
      </div>

      <hr />

      {/* Deposit/Withdraw Component 2 (mETH) */}

      <div className="exchange__transfers--form">
        <div className="flex-between">
          <p>
            <small> Token </small>
            <br />
            <img src = { logo2 } width = { 23 } alt = "Token Logo" />
            { symbols ? symbols[1] : "" }
          </p>
          <p>
            <small> Wallet </small>
            <br />
            { cryptoCurrencyBalance ? cryptoCurrencyBalance[1] : "" }
          </p>
          <p>
            <small> Exchange </small>
            <br />
            { exchangeDeposittedBalance ? exchangeDeposittedBalance[1] : "" }
          </p>
        </div>
        
        <form autoComplete = "off" onSubmit = { 
          (e) => { 
            depositHandler(e, contracts[1]) 
          }}
        >
          <label htmlFor="token1"><small> Deposit { symbols ? symbols[1] : "" } Amount </small></label>
          <input type = "text" id = "token1" value = { token2ExchangeBalance } placeholder = "0.0000" onChange = {
            (e) => {
              amountHandler(e, contracts[1]);
            }}
          />

          <button className="button" type="submit">
            <span> { depositWithdrawButton } </span>
          </button>
        </form>
      </div>

      <hr />
    </div>
  );
};

export default Balance;
