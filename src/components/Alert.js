import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { myEventSelector } from "../redux/selectors";
import truncateEthAddress from "truncate-eth-address";
import config from "../config.json";

const Alert = () => {
  let isPending = useSelector((state) => {
    return state.exchange.transaction.isPending;
  });

  let network = useSelector((state) => {
    return state.provider.network;
  });
  
  let isSuccessfull = useSelector((state) => {
    return state.exchange.transaction.isSuccessful;
  });

  let account = useSelector((state) => {
    return state.provider.account;
  });

  let alertRef = useRef("null");
  let events = useSelector(myEventSelector);

  useEffect(() => {
    if (isPending && account) {
      alertRef.current.className = "alert";
    }
  }, [isPending, account, events]);

  const removeAlertHandler = () => {
    alertRef.current.className = "alert--remove";
  }

  return(
    <div>
      {
        isPending
        ?
        <div className="alert alert--remove" onClick = { removeAlertHandler } ref = { alertRef }>
          <h1> Transaction Pending... </h1>
        </div>
        : (
          !isPending && isSuccessfull
          ?
          <div className="alert alert--remove" onClick = { removeAlertHandler } ref = { alertRef }>
            <h1> Transaction Successful! </h1>
              <a href = { 
                config[network] 
                ? 
                `${ config[network].explorerURL}/tx/${events && events[0] && events[0].transactionHash}`
                :
                "#"
              }
                target='_blank' rel='noreferrer'> 
                { events && events[0] && truncateEthAddress(events[0].transactionHash) }
              </a>
          </div>
          : (
            !isPending && !isSuccessfull &&
            <div className="alert alert--remove" onClick = { removeAlertHandler } ref = { alertRef }>
              <h1> Transaction Failed </h1>
            </div>
          )
        )
      }
      <div className="alert alert--remove"></div>
    </div>
  );
}

export default Alert;
