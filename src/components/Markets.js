import config from "../config.json";
import { useSelector, useDispatch } from "react-redux";
import { loadCryptoCurrencies } from "../redux/action_and_dispatch";

const Markets = () => {
  const dispatch = useDispatch();

  let chainID = useSelector((state) => {
    return state.provider.chainId;
  });

  let provider = useSelector((state) => {
    return state.provider.connection;
  });

  async function switchMarkets(e) {
    await loadCryptoCurrencies(e.target.value.split(","), provider, dispatch);
  }

  return (
    <div className="component exchange__markets">
      <div className="component__header">
        <h2> Select Markets </h2>
      </div>

      {chainID &&
      config[chainID] &&
      config[chainID].UZR &&
      config[chainID].mDAI &&
      config[chainID].mETH ? (
        <select name="markets" id="markets" onChange={switchMarkets}>
          <option
            value={`${config[chainID].UZR.address},${config[chainID].mETH.address}`}
          >
            {" "}
            UZR / mETH{" "}
          </option>
          <option
            value={`${config[chainID].UZR.address},${config[chainID].mDAI.address}`}
          >
            {" "}
            UZR / mDAI{" "}
          </option>
        </select>
      ) : (
        <em>
          <small>
            {" "}
            UZR crypto currency not deployed to this netowrk. No markets to
            show. Try changing the network from above.{" "}
          </small>
        </em>
      )}
      <hr />
    </div>
  );
};

export default Markets;
