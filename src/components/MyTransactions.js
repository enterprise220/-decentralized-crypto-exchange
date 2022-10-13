import { useDispatch, useSelector } from "react-redux";
import { MyTransactionsSelector } from "../redux/selectors";
import { MyOrdersSelector } from "../redux/selectors";
import Banner from "./Banner";
import sort from "../assets/img/sort.svg";
import { useRef, useState } from "react";
import { cancelOrder } from "../redux/action_and_dispatch";

const MyTransactions = () => {
  const myOpenOrders = useSelector(MyTransactionsSelector);
  const myTrades = useSelector(MyOrdersSelector);
  const orderRef = useRef();
  const tradesRef = useRef();
  const [showOrders, setShowOrders] = useState(true);

  const account = useSelector((state) => {
    return state.provider.account;
  });

  const symbols = useSelector((state) => {
    return state.CC.symbols;
  });

  const provider = useSelector((state) => {
    return state.provider.connection;
  });
  
  const exchange = useSelector((state) => {
    return state.exchange.exchange;
  });

  const dispatch = useDispatch();
  
  const toggleClasses = (e) => {
    if (e.target.className === "tab") {
      if (orderRef.current.className === "tab") {
        orderRef.current.className = "tab tab--active";
        tradesRef.current.className = "tab";
        setShowOrders(true);
      } else {
        tradesRef.current.className = "tab tab--active";
        orderRef.current.className = "tab";
        setShowOrders(false);
      }
    }
  };

  const cancelHandler = async (orderID) => {
    await cancelOrder(orderID, dispatch, provider, exchange);
  }

  return (
    <div className="component exchange__transactions">
      <div className="component__header flex-between">
        <h2> My Orders & Trades </h2>

        <div className="tabs">
          <button
            ref={orderRef}
            className="tab tab--active"
            onClick={(e) => toggleClasses(e)}
          >
            Orders
          </button>
          <button
            ref={tradesRef}
            className="tab"
            onClick={(e) => toggleClasses(e)}
          >
            Trades
          </button>
        </div>
      </div>
      {showOrders && (
        <div>
          {account && symbols ? (
            <table>
              <thead>
                <tr>
                  <th> {symbols[0] } <img src={sort} alt="Sort" /> </th>
                    <th> {symbols[0] && symbols[0]} { symbols[0] && symbols[1] && "/" } {symbols[1] && symbols[1]} <img src={sort} alt="Sort" /> </th>
                  <th> Actions </th>
                </tr>
              </thead>
              <tbody>
                {myOpenOrders?.length > 0 ? (
                  myOpenOrders?.map((singleOrder, index) => {
                    return (
                      <tr key={index}>
                        <td style={{ color: singleOrder.color }}>
                          {singleOrder.amountTokenZero}
                        </td>
                        <td> {singleOrder.tokenPrice} </td>
                        <td>
                          <button onClick = { () => cancelHandler(singleOrder.id) } className="button--sm"> Cancel </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <Banner text="No personal orders yet." />
                )}
              </tbody>
            </table>
          ) : (
            <Banner text="Connect Your Wallet." />
          )}
        </div>
      )}

      {!showOrders && (
        <div>
          {account && symbols ? (
            <table>
              <thead>
                <tr>
                  <th> Time <img src={sort} alt="Sort" /> </th>
                  <th> {symbols[0]} <img src={sort} alt="Sort" /> </th>
                  <th> {symbols[0]} { symbols[0] && symbols[1] && "/" } {symbols[1]} <img src={sort} alt="Sort" /> </th>
                </tr>
              </thead>
              <tbody>
                {myTrades?.length > 0 ? (
                  myTrades?.map((singleOrder, index) => {
                    return (
                      <tr key={index}>
                        <td> {singleOrder.time} </td>
                        <td style = {{ color: singleOrder.tokenZeroTradingColor }}> 
                          { singleOrder.arithmeticSign } { singleOrder.amountTokenZero }
                        </td>
                        <td> { singleOrder.tokenPrice } </td>
                      </tr>
                    );
                  })
                ) : (
                  <Banner text="No personal trades yet." />
                )}
              </tbody>
            </table>
          ) : (
            <Banner text="Connect Your Wallet." />
          )}
        </div>
      )}
    </div>
  );
};

export default MyTransactions;
