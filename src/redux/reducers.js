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
        default:
            return state;
    }
}

export { 
    provider 
}
