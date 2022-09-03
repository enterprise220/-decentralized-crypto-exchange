import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './App.css';
import store from "./redux/store.js";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById('root'));

/*
    Provider helps us wrap our entire app around redux.
    Hence, redux state will now be available like a "cloud storage"
    to the whole React app.
*/

root.render(
  <Provider store = { store }>
    <App />
  </Provider>
);
