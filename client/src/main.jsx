import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ToastContainer, toast } from 'react-toastify';
import "./index.css"; // Import global styles

// Create a root and render the App component
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastContainer />
    <App />
  </React.StrictMode>
);
