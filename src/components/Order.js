import { useState, useRef } from "react";

const Order = () => {
  const [ amount, setAmount ] = useState("0.0000");
  const [ price, setPrice ] = useState("0.0000");
  const [ buySellButton, setBuySellButton ] = useState("Buy");
  const buyRef = useRef();
  const sellRef = useRef();

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(buySellButton);
    // start from min 16
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

      <form autoComplete = "off" onSubmit = { submitHandler }>
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
