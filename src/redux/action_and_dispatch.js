import { ethers } from "ethers";
import TOKEN_ABI from "../abi/Token.json";
import EXCHANGE_ABI from "../abi/Exchange.json";

function loadProvider(dispatch) {
  /*
    Connect to the blockchain using the provider of ethers.js.
    Now, we are using ethers.js to connect front-end of the app
    to the back-end.
  */

  let connection = new ethers.providers.Web3Provider(window.ethereum);

  dispatch({
    type: "PROVIDER_LOADED",
    connection: connection,
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
    chainId: chainId,
  });

  return chainId;
}

async function loadAccount(dispatch, provider) {
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

  let account = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  account = account[0];

  dispatch({
    type: "ACCOUNT_LOADED",
    account: account,
  });

  let balance = await provider.getBalance(account);
  let formattedBalance = ethers.utils.formatEther(balance);

  dispatch({
    type: "BALANCE_LOADED",
    balance: formattedBalance,
  });

  return account;
}

async function loadCryptoCurrencies(addresses, provider, dispatch) {
  /*
    Connect to the specific smart contract (our CC)
    on that blockchain and read its symbol as a signal of
    confirmation of connection.
  */

  let token = new ethers.Contract(addresses[0], TOKEN_ABI, provider); // Connect to the token deployed on the blockchain
  let symbol = await token.symbol();

  dispatch({
    type: "TOKEN_LOADED_1",
    contract: token,
    symbol: symbol,
  });

  // Loading token 2 from the blockchain.

  token = new ethers.Contract(addresses[1], TOKEN_ABI, provider);
  symbol = await token.symbol();

  dispatch({
    type: "TOKEN_LOADED_2",
    contract: token,
    symbol: symbol,
  });
}

function loadExchange(address, provider, dispatch) {
  let exchange = new ethers.Contract(address, EXCHANGE_ABI, provider);

  dispatch({
    type: "EXCHANGE_LOADED",
    exchange: exchange,
  });

  return exchange;
}

function subscribeToEvents(exchange, dispatch) {
  exchange.on("Deposit", (smartContract, user, amount, balance, event) => {
    dispatch({
      type: "TRANSFER_SUCCESS",
      event: event
    });
  })
  exchange.on("Withdraw", (smartContract, user, amount, balance, event) => {
    dispatch({
      type: "TRANSFER_SUCCESS",
      event: event
    });
  })
}

async function loadBalances(cc, exchange, account, dispatch) {
  
  /*
    The following code checks if the user has purchased the 
    cryptocurrency 1 and 2 or not? If yes, their balance
    will be 0.0
  */
  
  let balance = await cc[0].balanceOf(account);
  balance = ethers.utils.formatUnits(balance, 18);

  dispatch({
    type: "TOKEN_1_BALANCE_LOADED",
    balance: balance,
  });

  balance = await cc[1].balanceOf(account);
  balance = ethers.utils.formatUnits(balance, 18);

  dispatch({
    type: "TOKEN_2_BALANCE_LOADED",
    balance: balance,
  });

  /*
    Has the user deposited any crypto funds for currency 01
    or for currency 02 in the exchange? If not, that user's
    balance will be 0.0
  */

  balance = await exchange.balanceOf(cc[0].address, account);
  balance = ethers.utils.formatUnits(balance, 18);

  dispatch({
    type: "EXCHANGE_USER_1_BALANCE_LOADED",
    balance: balance,
  });

  balance = await exchange.balanceOf(cc[1].address, account);
  balance = ethers.utils.formatUnits(balance, 18);

  dispatch({
    type: "EXCHANGE_USER_2_BALANCE_LOADED",
    balance: balance,
  });
}

async function transferTokens(transferType, cc, exchange, provider, amount, dispatch) {
  let signer, transaction;
  
  dispatch({
    type: "TRANSFER_REQUEST"
  });
  
  try {
    signer = provider.getSigner();
    amount = ethers.utils.parseUnits(amount.toString(), 18);

    if (transferType === "deposit") {
      transaction = await cc.connect(signer).approve(exchange.address, amount);
      await transaction.wait();
  
      transaction = await exchange.connect(signer).deposit(cc.address, amount);
      await transaction.wait();
    } 
    else {
      transaction = await exchange.connect(signer).withdraw(cc.address, amount);
      await transaction.wait();
    }
  }
  catch(error) {
    dispatch({
      type: "TRANSFER_FAILED"
    });
  }
  return;
}

export {
  loadProvider,
  loadNetwork,
  loadAccount,
  loadCryptoCurrencies,
  loadExchange,
  loadBalances,
  transferTokens,
  subscribeToEvents
};
