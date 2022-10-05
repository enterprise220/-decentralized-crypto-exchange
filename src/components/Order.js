import { useState, useRef } from "react";
import { makeBuyOrder, makeSellOrder } from "../redux/action_and_dispatch.js";
import { useDispatch, useSelector } from "react-redux";

const Order = () => {
  const [ amount, setAmount ] = useState("0.0000");
  const [ price, setPrice ] = useState("0.0000");
  const [ buySellButton, setBuySellButton ] = useState("Buy");
  const buyRef = useRef();
  const sellRef = useRef();
  const dispatch = useDispatch();

  let exchange = useSelector((state) => {
    return state.exchange.exchange;
  });

  let provider = useSelector((state) => {
    return state.provider.connection;
  });

  let contracts = useSelector((state) => {
    return state.CC.contracts;
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    
    buySellButton === "Buy"
    ?
    await makeBuyOrder(contracts, { amount, price }, dispatch, provider, exchange)
    :
    await makeSellOrder(contracts, { amount, price }, dispatch, provider, exchange)
    
    setAmount("0.0000");
    setPrice("0.0000");
  }
  
  const toggleClasses = (e) => {
    if (e.target.className === "tab") {
      if (buyRef.current.className === "tab") {
        buyRef.current.className = "tab tab--active";
        sellRef.current.className = "tab";
        setBuySellButton("Buy");
      }
      else {
        sellRef.current.className = "tab tab--active";
        buyRef.current.className = "tab";
        setBuySellButton("Sell");
      }
    }
  }

  return(
    <div className = "component exchange__orders">
      <div className = 'component__header flex-between'>
        <h2> New Order </h2>
        <div className = 'tabs'>
          <button onClick = { (e) => toggleClasses(e) } ref = { buyRef } className = 'tab tab--active'> Buy </button>
          <button onClick = { (e) => toggleClasses(e) } ref = { sellRef } className = 'tab'> Sell </button>
        </div>
      </div>

      <form autoComplete = "off" onSubmit = { (e) => submitHandler(e) }>
        <label htmlFor = "amount"><small> { buySellButton } Amount </small></label>
        <input type = "text" id = "amount" value = { amount } onChange = { (e) => setAmount(e.target.value) }
        />

        <label htmlFor = "price"><small> { buySellButton } Price </small></label>
        <input type = "text" id = "price" value = { price } onChange = { (e) => setPrice(e.target.value) }
        />
        <button className='button button--filled' type = 'submit'> { buySellButton } </button>
      </form>
    </div>
  );
}

export default Order;
