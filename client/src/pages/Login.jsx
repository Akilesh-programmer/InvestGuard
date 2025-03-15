import React from "react";

const Login = () => {
  return (
    <div className="relative h-screen flex items-center justify-center bg-gray-900 text-white overflow-hidden">
      {/* White droplet */}
      <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-white rounded-full opacity-80 transform -translate-x-56 -translate-y-32" />

      {/* Green droplet */}
      <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-green-500 rounded-full opacity-80 transform translate-x-56 translate-y-32" />

      <div className="bg-gray-800 p-10 rounded-lg shadow-3xl w-[700px] relative z-10 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 bg-opacity-30 shadow-[0px_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-3xl">
        <form className="space-y-6">
          <input
            type="text"
            placeholder="User Name"
            className="w-full p-4 text-lg text-center rounded bg-transparent text-white border-b-2 border-white focus:outline-none focus:ring-0 placeholder-white"
          />
          <input
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
            <a href="#" className="text-blue-500 hover:text-green-300">
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
