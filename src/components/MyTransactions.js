import { useSelector } from "react-redux";
import { MyTransactionsSelector } from "../redux/selectors";
import Banner from "./Banner";
import sort from "../assets/img/sort.svg";

const MyTransactions = () => {

  const myOpenOrders = useSelector(MyTransactionsSelector);
  
  const account = useSelector((state) => {
    return state.provider.account;
  });

  const symbols = useSelector((state) => {
    return state.CC.symbols;
  });

  
  return (
    <div className="component exchange__transactions">
      <div>
        <div className='component__header flex-between'>
          <h2>My Orders</h2>

          <div className='tabs'>
            <button className='tab tab--active'>Orders</button>
            <button className='tab'>Trades</button>
          </div>
        </div>

          {
            account && symbols
            ?
            <table>
              <thead>
                <tr>
                  <th> { symbols[0] } <img src = { sort } alt = "Sort" /> </th>
                  <th> { symbols[0] } / { symbols[1] } <img src = { sort } alt = "Sort" /> </th>
                  <th> Actions </th>
                </tr>
              </thead>
              <tbody>
                {
                  myOpenOrders?.length > 0
                  ?
                  myOpenOrders?.map((singleOrder, index) => {
                    return(
                      <tr key = { index }>
                        <td style = {{ color: singleOrder.color }}> { singleOrder.amountTokenZero } </td>
                        <td> { singleOrder.tokenPrice } </td>
                        <td><button className="button"> Cancel </button></td>
                      </tr>
                    );
                  })
                  :
                  <Banner text = "No orders placed yet." />
                }
              </tbody>
            </table>
            :
            <Banner text = "Connect Your Wallet." />
          }

      </div>

      {/* <div> */}
        {/* <div className='component__header flex-between'> */}
          {/* <h2>My Transactions</h2> */}

          {/* <div className='tabs'> */}
            {/* <button className='tab tab--active'>Orders</button> */}
            {/* <button className='tab'>Trades</button> */}
          {/* </div> */}
        {/* </div> */}

        {/* <table> */}
          {/* <thead> */}
            {/* <tr> */}
              {/* <th></th> */}
              {/* <th></th> */}
              {/* <th></th> */}
            {/* </tr> */}
          {/* </thead> */}
          {/* <tbody> */}

            {/* <tr> */}
              {/* <td></td> */}
              {/* <td></td> */}
              {/* <td></td> */}
            {/* </tr> */}

          {/* </tbody> */}
        {/* </table> */}

      {/* </div> */}
    </div>
  )
}

export default MyTransactions;