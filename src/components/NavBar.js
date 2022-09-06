import logo from "../assets/img/logo.svg";
import { useSelector } from "react-redux";
import truncateEthAddress from 'truncate-eth-address'

function NavBar() {
    let account = useSelector((state) => {
        return state.provider.account;
    });
    
    let balance = useSelector((state) => {
        return state.provider.balance;
    });
    
    return(
        <div className = 'exchange__header grid'>
          <div className = 'exchange__header--brand flex'>
            <img className = "logo" src = { logo } alt = "DEX Logo"/>
            <h1> Decentralized Crypto Exchange ( DEX ) </h1>
          </div>
    
          <div className = 'exchange__header--networks flex'>
          
          </div>
    
          <div className = 'exchange__header--account flex'>
          <p> <small> My Balance: </small> { balance && Number(balance).toFixed(4) } ETH </p>
          { account && <a href = "#"> { truncateEthAddress(account) } </a> }
          </div>
        </div>
    )
}

export default NavBar;
