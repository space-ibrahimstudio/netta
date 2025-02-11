import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { IbrahimStudioProvider } from "@ibrahimstudio/react";
import { AuthProvider } from "./libs/securities/auth";
import { ApiProvider } from "./libs/apis/office";
import { LoadingProvider } from "./components/feedbacks/context/loading-context";
import { NotificationsProvider } from "./components/feedbacks/context/notifications-context";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <IbrahimStudioProvider>
          <NotificationsProvider>
            <LoadingProvider>
              <AuthProvider>
                <ApiProvider>
                  <App />
                </ApiProvider>
              </AuthProvider>
            </LoadingProvider>
          </NotificationsProvider>
        </IbrahimStudioProvider>
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
