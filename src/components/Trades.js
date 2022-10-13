import { useSelector } from "react-redux";
import { TradesSelector } from "../redux/selectors";
import Banner from "./Banner";
import sort from "../assets/img/sort.svg";

const Trades = () => {
  let trades = useSelector(TradesSelector);
  let symbols = useSelector((state) => {
    return state.CC.symbols;
  });

  return(
    <div className="component exchange__trades">
      <div className='component__header flex-between'>
        <h2> Recent Public Trades </h2>
      </div>

      {
        symbols && symbols[0] && symbols[1] && trades && trades[0] && trades[0].time
        ?
          <table>
            <thead>
              <tr>
                <th> Time </th>
                <th> { symbols[0] } <img src = { sort } alt = "Sort" /> </th>
                <th> {  symbols[0] } / { symbols[1] } <img src = { sort } alt = "Sort" /> </th>
              </tr>
            </thead>
            <tbody>
              {
                trades.map((singleTrade, index) => {
                  return(
                    <tr key = { index }>
                      <td> { singleTrade.time } </td>
                      <td> { singleTrade.amountTokenZero} </td>
                      <td> { singleTrade.tokenPrice } </td>
                    </tr>
                  );
                })
              }
            </tbody>
        </table>
        :
        <Banner text = { 
          `No public trades yet.` } />
      }
    </div>
  );
}

export default Trades;