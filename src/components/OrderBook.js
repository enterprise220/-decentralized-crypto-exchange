import { useDispatch, useSelector } from "react-redux";
import sort from "../assets/img/sort.svg";
import { orderBookSelector } from "../redux/selectors";
import { fillOrder } from "../redux/action_and_dispatch";

const OrderBook = () => {
  const symbols = useSelector((state) => {
    return state.CC.symbols;
  });

  let orderBook = useSelector(orderBookSelector);
  
  const filledOrders = useSelector((state) => {
    return state.exchange.filledOrders.data
  });

  const cancelledOrders = useSelector((state) => {
    return state.exchange.cancelledOrders.data
  });

  const provider = useSelector((state) => {
    return state.provider.connection;
  });
  
  const exchange = useSelector((state) => {
    return state.exchange.exchange;
  });

  const dispatch = useDispatch();
  

  const fillOrderHandler = async (orderID) => {
    await fillOrder(orderID, dispatch, provider, exchange);
  }
  
  return (
    <div className="component exchange__orderbook">
      <div className="component__header flex-between">
        <h2>Order Book</h2>
      </div>

      <div className="flex">
        {
          filledOrders && cancelledOrders && orderBook && orderBook[0] && orderBook[0].length > 0 
          ?
          <table className="exchange__orderbook--sell">
            <caption>Selling</caption>
            <thead>
              <tr>
                <th> { symbols && symbols[0] } <img src = { sort } alt = "Sort Img"/> </th>
                <th> { symbols && symbols[0] } / { symbols && symbols[1] } <img src = { sort } alt = "Sort Img"/> </th>
                <th> { symbols && symbols[1] } <img src = { sort } alt = "Sort Img"/> </th>
              </tr>
            </thead>
            <tbody>
              {
                orderBook[0].map((singleOrder, index) => {
                  return(
                    <tr key = { singleOrder.id } onClick = { () => fillOrderHandler(singleOrder.id) }>
                      <td> { singleOrder.amountTokenZero } </td>
                      <td style = {{ color: singleOrder.color }}> { singleOrder.tokenPrice } </td>
                      <td> { singleOrder.amountTokenOne } </td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
          :
          "No Sell Orders Placed Yet."
        }

        <div className="divider"></div>
        {
          orderBook && orderBook[1] && orderBook[1].length > 0 
          ?
          <table className="exchange__orderbook--buy">
          <caption>Buying</caption>
          <thead>
            <tr>
              <th> { symbols && symbols[0] } <img src = { sort } alt = "Sort Img"/> </th>
              <th> { symbols && symbols[0] } / { symbols && symbols[1] } <img src = { sort } alt = "Sort Img"/> </th>
              <th> { symbols && symbols[1] } <img src = { sort } alt = "Sort Img"/> </th>
            </tr>
          </thead>
          <tbody>
            {
              orderBook[1].map((singleOrder) => {
                return(
                  <tr key = { singleOrder.id } onClick = { () => fillOrderHandler(singleOrder.id) }>
                    <td> { singleOrder.amountTokenZero } </td>
                    <td style = {{ color: singleOrder.color }}> { singleOrder.tokenPrice } </td>
                    <td> { singleOrder.amountTokenOne } </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
        :
        "No Buy Orders Placed Yet."
        }
      </div>
    </div>
  );
};

export default OrderBook;
