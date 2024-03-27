import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import "bootstrap/dist/css/bootstrap.min.css";

import "./assets/css/fonts.css";

import { ConfigProvider, message } from "antd";
import enUS from "antd/lib/locale/en_US"; // import English language

import { BrowserRouter } from "react-router-dom";
import { CompanyProvider } from "./contexts/CompanyContext";

// Customize the message placement
message.config({
  top: 50, // Set the top offset
  duration: 2, // Set the default duration
  maxCount: 3, // Set the max count of messages to be displayed
});

// index.js or App.js

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then((registration) => {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      })
      .catch((error) => {
        console.log("ServiceWorker registration failed: ", error);
      });
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ConfigProvider locale={enUS}>
      <CompanyProvider>
        {/* <ErrorBoundary> */}
        <App />
        {/* </ErrorBoundary> */}
      </CompanyProvider>
    </ConfigProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
