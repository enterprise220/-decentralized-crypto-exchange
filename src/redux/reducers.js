/*
    Reducers are functions. These functions get data from
    the dispatcher and perform some operations on it.

    Hence, reducers are where pre-processing of the data
    takes place before it can go to the store.
*/

function provider(state = {}, action) {
    switch (action.type) {
        case "PROVIDER_LOADED":
            return {
                ...state,
                connection: action.connection
            };
        
        case "NETWORK_LOADED":
            return {
                ...state,
                chainId: action.chainId
            };
        
        case "ACCOUNT_LOADED":
            return {
                ...state,
                account: action.account
            };
        
        default:
            return state;
    }
}

function token(state = {loaded: false, contract: null}, action) {
    switch (action.type) {
        case "TOKEN_LOADED":
            return {
                ...state,
                loaded: true,
                contract: action.contract,
                symbol: action.symbol
            };
        
        default:
            return state;
    }
}

export { 
    provider,
    token
}
