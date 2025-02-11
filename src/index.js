import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import { IbrahimStudioProvider } from "@ibrahimstudio/react";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
// define gtag initialization in public/index.html to enable this function
const sendtoGA = ({ name, delta, id }) => {
  if (typeof window.gtag === "function") {
    window.gtag("event", name, {
      event_category: "Web Vitals",
      event_label: id,
      value: Math.round(name === "CLS" ? delta * 1000 : delta),
      non_interaction: true,
    });
  } else {
    console.warn("gtag function is not available");
  }
};
// report to browser console on dev mode
const sendtoLog = ({ name, delta, id }) => {
  console.log(`[DEV] ${name}:`, { id, delta });
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <IbrahimStudioProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </IbrahimStudioProvider>
    </HelmetProvider>
  </React.StrictMode>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
if (process.env.NODE_ENV === "production") {
  reportWebVitals(sendtoGA);
} else {
  reportWebVitals(sendtoLog);
}
