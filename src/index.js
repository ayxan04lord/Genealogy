import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// vis-network-dən gələn ResizeObserver xəbərdarlığını sustur
// Bu xəta funksionallığa təsir etmir, yalnız konsolda trivia xəbərdarlığıdır
const _onerror = window.onerror;
window.onerror = (msg, ...args) => {
  if (typeof msg === "string" && msg.includes("ResizeObserver loop")) return true;
  return _onerror ? _onerror(msg, ...args) : false;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
