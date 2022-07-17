import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import VideoRoomComponent from "./components/VideoRoomComponent";
import registerServiceWorker from "./registerServiceWorker";
import App from "./App";
import Main from "./main/main";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from './store.js'


ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
  ,
  document.getElementById("root")
);


registerServiceWorker();