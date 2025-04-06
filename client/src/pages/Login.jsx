import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";

// Success Toast
const showSuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  });
};

// Error Toast
const showError = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  });
};

const showInfoMessage = () => {
  toast.info(
    "First Time connecting might take around 30 second due to spin down of backend due to inactivity... Please be patient...",
    {
      position: "top-right",
      autoClose: 5000, // 5 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    }
  );
};

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    showInfoMessage();
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const response = await fetch(`${API_URL}login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.status === 401) {
        showError("User does not exist or password is wrong.");
        return;
      }

      const data = await response.json();
      const token = data.token;

      if (token) {
        localStorage.setItem("token", token);
      } else {
        showError("Something went wrong, please try again");
        return;
      }

      showSuccess("Login Successful");
      navigate(`/home/${username}/${password}`);
    } catch (error) {
      console.error("Network Error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative h-screen flex items-center justify-center bg-gray-900 text-white overflow-hidden">
      {/* White droplet */}
      <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-white rounded-full opacity-80 transform -translate-x-56 -translate-y-32" />

      {/* Green droplet */}
      <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-green-500 rounded-full opacity-80 transform translate-x-56 translate-y-32" />

      <div className="bg-gray-800 p-10 rounded-lg shadow-3xl w-[700px] relative z-10 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 bg-opacity-30 shadow-[0px_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-3xl">
        {loading && <Loader />}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="username"
            type="text"
            placeholder="User Name"
            className="w-full p-4 text-lg text-center rounded bg-transparent text-white border-b-2 border-white focus:outline-none focus:ring-0 placeholder-white"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full p-4 text-lg text-center rounded bg-transparent text-white border-b-2 border-white focus:outline-none focus:ring-0 placeholder-white"
          />

          {/* Forgot Password Link */}
          <div className="flex justify-start text-sm mb-4">
            <a href="#" className="text-blue-500 hover:text-green-300">
              Forgot Password?
            </a>
          </div>

          <button className="w-full py-2 text-lg rounded bg-orange-700 hover:bg-green-600 text-white font-semibold shadow-lg">
            Login
          </button>

          <p className="text-center text-base mt-3">
            New User?{" "}
            <Link to="/register" className="text-blue-500 hover:text-green-300">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
