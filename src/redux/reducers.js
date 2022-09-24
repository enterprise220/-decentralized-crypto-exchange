/*
  Reducers are functions that update state in the store.
  These functions get data from the dispatcher and perform
  some operations on it.

  Hence, reducers are where pre-processing of the data
  takes place before it can go to the store.

  The store itself is immutable. So, that's why we have to
  copy the whole object using the spread operator again and
  again.
*/

function provider(state = {}, action) {
  switch (action.type) {
    case "PROVIDER_LOADED":
      return {
        ...state,
        connection: action.connection,
      };

    case "NETWORK_LOADED":
      return {
        ...state,
        chainId: action.chainId,
      };

    case "ACCOUNT_LOADED":
      return {
        ...state,
        account: action.account,
      };

    case "BALANCE_LOADED":
      return {
        ...state,
        balance: action.balance,
      };

    default:
      return state;
  }
}

function cryptoCurrencies(state = { loaded: false, contracts: [], symbols: [] }, action) {
  switch (action.type) {
    case "TOKEN_LOADED_1":
      return {
        ...state,
        loaded: true,
        contracts: [action.contract],
        symbols: [action.symbol],
      };

    case "TOKEN_1_BALANCE_LOADED":
      return {
        ...state,
        balances: [action.balance],
      };

    case "TOKEN_LOADED_2":
      return {
        ...state,
        loaded: true,
        contracts: [...state.contracts, action.contract],
        symbols: [...state.symbols, action.symbol],
      };

    case "TOKEN_2_BALANCE_LOADED":
      return {
        ...state,
        balances: [...state.balances, action.balance],
      };

    default:
      return state;
  }
}

function exchange(state = { loaded: false, exchange: null, transaction: { isSuccessful: false }, events: [] }, action) {
  switch (action.type) {
    case "EXCHANGE_LOADED":
      return {
        ...state,
        loaded: true,
        exchange: action.exchange,
      };

    case "EXCHANGE_USER_1_BALANCE_LOADED":
      return {
        ...state,
        balances: [action.balance],
      };

    case "EXCHANGE_USER_2_BALANCE_LOADED":
      return {
        ...state,
        balances: [...state.balances, action.balance],
      };

      case "TRANSFER_REQUEST":
        return {
          ...state,
          transaction: {
            transactionType: "Transfer",
            isPending: true,
            isSuccessful: false
          },
          transferInProgress: true
        };
      
      case "TRANSFER_SUCCESS":
        return {
          ...state,
          transaction: {
            transactionType: "Transfer",
            isPending: false,
            isSuccessful: true
          },
          transferInProgress: false,
          events: [ action.event, ...state.events ]
        };

        case "TRANSFER_FAILED":
          return {
            ...state,
            transaction: {
              transactionType: "Transfer",
              isPending: false,
              isSuccessful: false, 
              isError: true
            },
            transferInProgress: false,
          };

    default:
      return state;
  }
}

export { provider, cryptoCurrencies, exchange };
