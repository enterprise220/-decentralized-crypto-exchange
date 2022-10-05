import { useSelector } from "react-redux";
import { TradesSelector } from "../redux/selectors";
import Banner from "./Banner";

const Trades = () => {
  let trades = useSelector(TradesSelector);
  let symbols = useSelector((state) => {
    return state.CC.symbols;
  });

  return(
    <div className="component exchange__trades">
      <div className='component__header flex-between'>
        <h2>Trades</h2>
      </div>

      {
        trades && trades[0] && trades[0].time && symbols
        ?
          <table>
            <thead>
              <tr>
                <th> Time </th>
                <th> { symbols[0] } </th>
                <th> {  symbols[0] } / { symbols[1] } </th>
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
          `No Trades for ${ symbols && symbols[0] } / ${ symbols && symbols[1] }` } />
      }
    </div>
  );
}

export default Trades;