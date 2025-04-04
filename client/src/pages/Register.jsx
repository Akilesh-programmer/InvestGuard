import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const Register = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    if(!email.endsWith("@gmail.com") && !email.endsWith("@yahoo.com")) {
      showError("Only gmail and yahoo mail addresses are allowed...");
      return;
    }

    try {
      const response = await fetch(`${API_URL}register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (response.status === 400) {
        showError("User already exists");
        return;
      }

      const data = await response.json();

      showSuccess("Registration Successful");
      navigate("/login");
    } catch (error) {
      console.error("Network Error:", error.message);
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center bg-gray-900 text-white overflow-hidden">
      {/* White droplet */}
      <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-white rounded-full opacity-80 transform -translate-x-56 -translate-y-32" />

      {/* Green droplet */}
      <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-green-500 rounded-full opacity-80 transform translate-x-56 translate-y-32" />

      <div className="bg-gray-800 p-10 rounded-lg shadow-3xl w-[700px] relative z-10 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 bg-opacity-30 shadow-[0px_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-3xl">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            name="username"
            type="text"
            placeholder="User Name"
            className="w-full p-4 text-lg text-center rounded bg-transparent text-white border-b-2 border-white focus:outline-none focus:ring-0 placeholder-white"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full p-4 text-lg text-center rounded bg-transparent text-white border-b-2 border-white focus:outline-none focus:ring-0 placeholder-white"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full p-4 text-lg text-center rounded bg-transparent text-white border-b-2 border-white focus:outline-none focus:ring-0 placeholder-white"
          />
          <div className="flex items-center space-x-3 text-base">
            <input
              type="checkbox"
              id="terms"
              className="w-5 h-5 text-green-500 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="text-gray-300">
              By clicking, you accept our terms and conditions
            </label>
          </div>
          {/* Register button now matches placeholder font and is adjusted in height */}
          <button className="w-full py-2 text-lg rounded bg-orange-700 hover:bg-green-600 text-white font-semibold shadow-lg">
            Register
          </button>
          <p className="text-center text-base mt-3">
            Already a user?{" "}
            <Link to="/" className="text-blue-500 hover:text-green-300">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
