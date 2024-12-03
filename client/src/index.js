import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import store from "./store/index";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import reportWebVitals from "./reportWebVitals";
const App = lazy(() => import("./App"));

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <Suspense fallback="Loading....">
      <App />
      <Toaster
      // toastOptions={{
      //   duration: 3000,
      //   position: "top right",
      //   success: {
      //     style: {
      //       background: "#283046",
      //       color: "white",
      //     },
      //   },
      //   error: {
      //     style: {
      //       background: "red",
      //       color: "white",
      //     },
      //   },
      // }}
      />
    </Suspense>
  </Provider>
);

reportWebVitals();
