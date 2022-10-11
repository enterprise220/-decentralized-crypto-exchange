import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";

const Alert = () => {
  let isPending = useSelector((state) => {
    return state.exchange.transaction.isPending;
  });
  
  let isSuccessful = useSelector((state) => {
    return state.exchange.transaction.isSuccessful;
  });

  let account = useSelector((state) => {
    return state.provider.account;
  });

  let alertRef = useRef("null");

  useEffect(() => {
    if (isPending && account) {
      alertRef.current.className = "alert";
    }
  }, [isPending, account]);

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
          !isPending && isSuccessful
          ?
          <div className="alert alert--remove" onClick = { removeAlertHandler } ref = { alertRef }>
            <h1> Transaction Successful! </h1>
              <a href='' target='_blank' rel='noreferrer'> </a>
          </div>
          : (
            !isPending && !isSuccessful &&
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