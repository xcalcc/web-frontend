import "@babel/polyfill";
import "core-js";
import "raf/polyfill";
import React from "react";
import ReactDOM from "react-dom";
import './i18n';
import { Provider } from 'react-redux';
import store from 'Redux/store';
import {BrowserRouter} from "react-router-dom";
import "./index.scss";
import App from "./App";
/* import * as serviceWorker from "./serviceWorker"; */

ReactDOM.render(
  <BrowserRouter>
      <React.StrictMode>
          <Provider store={store}>
              <BrowserRouter>
                  <App />
              </BrowserRouter>
          </Provider>
      </React.StrictMode>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA

/* serviceWorker.register(); */
