// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from './App.jsx'
import { RouterProvider } from "react-router-dom";
import router from "./routers/router.jsx";

import { store } from "./redux/store.js";
import { Provider } from "react-redux";

import "sweetalert2/dist/sweetalert2.js";

import SearchResultsPage from "./pages/SearchResultsPage";
import Home from "./pages/home/Home.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
