import Banner from "./Banner";
import { useSelector } from "react-redux";
import ArrowDown from "../assets/img/down-arrow.svg";
import ArrowUp from "../assets/img/up-arrow.svg";
import Chart from "react-apexcharts";
import { options, series as dummySeries } from "./PriceChart.config";
import { priceChartSelector } from "../redux/selectors";

const PriceChart = () => {
  const account = useSelector((state) => {
    return state.provider.account;
  });

  const symbols = useSelector((state) => {
    return state.CC.symbols;
  });

  const priceChart = useSelector(priceChartSelector);

  return(
    <div className="component exchange__chart">
      <div className='component__header flex-between'>
        {
          symbols && symbols[0] && symbols[1] &&
          <div className='flex'>
            <h2> { symbols[0] } / { symbols[1] } </h2>
            <div className = 'flex'>
              { 
                priceChart && priceChart.lastPriceChange === "+" 
                ?
                <img src = { ArrowUp } alt = "Arrow up" />
                : 
                <img src = { ArrowDown } alt = "Arrow down" />
              }
              <span className = 'up'> { priceChart && priceChart.lastPrice } </span>
            </div>
        </div>
        }
      </div>
      {
        account
        ?
        <Chart
          type = "candlestick"
          height = "100%"
          width = "100%"
          options = { options }
          series = { priceChart ? priceChart.series :  dummySeries }
        />
        :
        <Banner
          text = "Connect Your Wallet."
        />
      }
    </div>
  );
}

export default PriceChart;
