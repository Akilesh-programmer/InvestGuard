import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "./App.css"; // Optional: Custom styles
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <div className="app-container text-5xl h-full bg-zinc-900">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
