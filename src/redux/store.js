import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { provider, cryptoCurrencies as CC, exchange } from "./reducers";

let reducer = combineReducers({
  provider, 
  CC,
  exchange
});

let initialState = {};
let middleWare = [thunk];

/*
  Store is the place where all the data is stored.

  The store imports and combines all the reducers together and
  uses the state and the middleware to create a tiny "database"
  for us in the front-end of the project.
*/

let store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleWare)));

export default store;
