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

let DEFAULT_EXCHANGE_REDUX_STATE = {
  loaded: false, 
  exchange: null, 
  transaction: { 
    isSuccessful: false 
  }, 
  allOrders: { 
    data: [] 
  }, 
  events: [] 
};

function exchange(state = DEFAULT_EXCHANGE_REDUX_STATE, action) {
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

    /*
      FOR DEPOSIT AND WITHDRAWAL REQUESTS, 
      WE DO THE FOLLOWING CASES
    */

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

      /*
        FOR BUY AND SELL ORDER REQUESTS, 
        WE DO THE FOLLOWING CASES
      */

      case "NEW_ORDER_REQUEST":
        return {
          ...state,
          transaction: {
            transactionType: "New Order",
            isPending: true,
            isSuccessful: false
          },
        };

      case "NEW_ORDER_FAILED":
        return {
          ...state,
          transaction: {
            transactionType: "New Order",
            isPending: false,
            isSuccessful: false, 
            isError: true
          },
        };

      case "NEW_ORDER_SUCCESS":
        /*
          Prevent duplicate orders.
        */
      
        let data;
        let index = state.allOrders.data.findIndex((order) => {
          return(order.id === action.order.id);
        });

        index === -1 ? data = [ action.order, ...state.allOrders.data ] : data = state.allOrders.data;
      
        return {
          ...state,
          transaction: {
            transactionType: "New Order",
            isPending: false,
            isSuccessful: true
          },
          allOrders: {
            ...state.allOrders, 
            data: data
          },
          events: [ action.event, ...state.events ]
        };

    default:
      return state;
  }
}

export { provider, cryptoCurrencies, exchange };
