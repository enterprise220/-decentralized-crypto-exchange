import { createSelector } from "reselect";
import { get, groupBy, reject } from "lodash";
import { ethers } from "ethers";
import moment from "moment";

import { useSelector } from "react-redux";


const tokens = state => get(state, "CC.contracts");
const allOrders = state => get(state, "exchange.allOrders.data", []);
const cancelledOrders = state => get(state, "exchange.cancelledOrders.data", []);
const filledOrders = state => get(state, "exchange.filledOrders.data", []);

const getOrderType = (order, tokens) => {
  return(order.tokenGive === tokens[1].address ? "Buy" : "Sell");
}

const openOrders = state => {
  const all = allOrders(state);
  const filled = filledOrders(state);
  const cancelled = cancelledOrders(state);

  const openOrders = reject(all, (order) => {
    const orderFilled = filled.some((o) => o.id.toString() === order.id.toString())
    const orderCancelled = cancelled.some((o) => o.id.toString() === order.id.toString())
    return(orderFilled || orderCancelled)
  })

  return openOrders

}
const decorateOrder = (order, tokens) => {
  let amountTokenZero, amountTokenOne;

  if (order.tokenGive === tokens[1].address) { // User 1 is giving away mETH for UZR. Their tokenGive is token[1]
    /*
      From the perspective of user 2, we write code down below.
      User 2 will have to give token 0 (not token 1), called UZR, that user 1 wants.

      So, even though the conditional statement says that mETH is tokenGive, 
      still give amount is that of token UZR's. Because the conditional statement is
      for user 1's perspective (as they made the order) and the code in the if block
      is from user 2's perspective, as they are filling the order.
    */
    
    amountTokenZero = order.amountGive; // User 2 gives this amount of UZR
    amountTokenOne = order.amountGet; // User 2 gets this amount of mETH
  }
  else if (order.tokenGive === tokens[0].address) { // User 1 wants mETH for UZR
    amountTokenZero = order.amountGet;
    amountTokenOne = order.amountGive;
  }

  let decimalPrecision = 100000; // Round off to 5th decimal place.
  let tokenPrice = amountTokenOne / amountTokenZero;
  tokenPrice = Math.round(tokenPrice * decimalPrecision) / decimalPrecision;

  return({
    ...order, 
    amountTokenZero: amountTokenZero && ethers.utils.formatUnits(amountTokenZero, "ether"),
    amountTokenOne: amountTokenOne && ethers.utils.formatUnits(amountTokenOne, "ether"),
    tokenPrice: tokenPrice,
    time: moment.unix(order.timestamp).format("h:mm:ssa d MMM D"),
    orderType: getOrderType(order, tokens),
    color: getOrderType(order, tokens) === "Buy" ? "#25CE8F" : "#F45353", // Green for buy order, else red.
    orderFillAction: getOrderType(order, tokens) === "Buy" ? "Sell" : "Buy", // filling action is always opposite
  });
}

export const orderBookSelector = createSelector(openOrders, tokens, (orders, tokens) => {
  if (!tokens[0] || !tokens[1]) {
    return;
  }
 
  orders.filter((order) => {
    return(order.tokenGive === tokens[0].address || order.tokenGet === tokens[0].address);
  });

  orders.filter((order) => {
    return(order.tokenGive === tokens[1].address || order.tokenGet === tokens[1].address);
  });

  // Decorate orders
  let allDecoratedOrders = orders.map((singleOrder) => {
    return decorateOrder(singleOrder, tokens);
  });
  
  // Group decorated orders by "Buy" or "Sell" orders and sort them
  let groupedOrders = groupBy(allDecoratedOrders, "orderType");
  let buyOrders = groupedOrders["Buy"];
  buyOrders = buyOrders && buyOrders.sort((a, b) => b.tokenPrice - a.tokenPrice)
  let sellOrders = groupedOrders["Sell"];
  sellOrders = sellOrders && sellOrders.sort((a, b) => b.tokenPrice - a.tokenPrice)
  let groupedSortedOrders = [sellOrders, buyOrders];

  return groupedSortedOrders;
});
