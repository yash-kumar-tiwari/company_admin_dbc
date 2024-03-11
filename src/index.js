import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import "bootstrap/dist/css/bootstrap.min.css";

import "@fontsource/roboto"; // Defaults to weight 400
import "@fontsource/roboto/400.css"; // Specify weight
import "@fontsource/roboto/400-italic.css"; // Specify weight and style

import { ConfigProvider, message } from "antd";
import { LocaleProvider } from "antd";
import enUS from "antd/lib/locale/en_US"; // import English language

import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./pages/Dashboard/Error/ErrorBoundary";

// Customize the message placement
message.config({
  top: 50, // Set the top offset
  duration: 2, // Set the default duration
  maxCount: 3, // Set the max count of messages to be displayed
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ConfigProvider locale={enUS}>
      {/* <ErrorBoundary> */}
      <App />
      {/* </ErrorBoundary> */}
    </ConfigProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
