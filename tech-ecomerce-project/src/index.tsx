import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ReduxProvider } from "./../src/store/ReduxProvider";
import { Toaster } from "sonner";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ReduxProvider>
      <App />
      <Toaster />
    </ReduxProvider>
  </React.StrictMode>
);
