import { createSelector } from "reselect";
import { get } from "lodash";

const tokens = state => get(state, "CC.contracts");

const allOrders = (state) => {
  get(state, "exchange.allOrders.data", []);
}

export const orderBookSelector = createSelector(allOrders, tokens, (orders, tokens) => {
  if (!tokens[0] || !tokens[1]) {
    return;
  }
 
  orders.filter((order) => {
    return(order.tokenGet === tokens[0].address || order.tokenGet === tokens[1].address);
  });

  orders.filter((order) => {
    return(order.tokenGive === tokens[0].address || order.tokenGive === tokens[1].address);
  });

  // Decorate orders

  // Start from min 20
  
});
