import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ToastContainer } from 'react-toastify';
import "./index.css"; // Import global styles

// Create a root and render the App component
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastContainer position="top-right" autoClose={3000} />
    <App />
  </React.StrictMode>
);
