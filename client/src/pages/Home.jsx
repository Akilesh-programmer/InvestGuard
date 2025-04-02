import React from "react";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import AddStockForm from "./AddStockForm";
import { useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { useParams } from "react-router-dom";

const Home = () => {
  const { username, password } = useParams();
  console.log(password);
  console.log(username);

  const navigate = useNavigate();
  const axiosInstance = useAxios();

  const [stocks, setStocks] = useState([]); // Store stock data

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axiosInstance.get("/stocks", {
          auth: {
            username,
            password,
          },
        });
        setStocks(response.data);
      } catch (error) {
        console.error("Error fetching stocks", error);
        alert("Invalid credentials or network issue!");
      }
    };

    fetchStocks(); // Automatically fetch stocks on mount
  }, []);

  useEffect(() => {
    console.log("Updated stocks:", stocks);
  }, [stocks]); // This runs whenever `stocks` updates

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove JWT token
    navigate("/login"); // Redirect to login page
  };

  // Sample Data
  const user = { name: username };
  const stockData = {
    totalInvestments: 10,
    currentValue: 40,
    profitLoss: 10,
  };

  const data = [
    {
      name: "Total Investment",
      value: stockData.totalInvestments,
      color: "#8884d8",
    },
    { name: "Current Value", value: stockData.currentValue, color: "#82ca9d" },
    { name: "Profit/Loss %", value: stockData.profitLoss, color: "#ff7300" },
  ];

  const [showForm, setShowForm] = useState(false);

  return (
    <div className="h-screen bg-zinc-800 text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-center items-center p-4 text-lg space-x-10 relative">
        <div className="flex-1 flex justify-center space-x-10">
          <a
            href="#"
            className="bg-gray-700 px-4 py-2 rounded-lg text-white hover:bg-gray-600"
          >
            Stocks
          </a>
          <a
            href="#"
            className="bg-gray-700 px-4 py-2 rounded-lg text-white hover:bg-gray-600"
          >
            Portfolio
          </a>
          <a
            href="#"
            className="bg-gray-700 px-4 py-2 rounded-lg text-white hover:bg-gray-600"
          >
            Notifications
          </a>
        </div>
        <div className="absolute right-4 mt-2 flex space-x-4">
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-500 text-white px-4 py-3 rounded-lg text-xl hover:bg-green-600 flex items-center space-x-2"
          >
            <span>Add Stock</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
          {showForm && (
            <AddStockForm stocks={stocks} username={username} password={password} onClose={() => setShowForm(false)} />
          )}
          <button
            onClick={handleLogout}
            className="bg-black text-red-400 px-4 py-3 rounded-lg text-xl hover:bg-gray-900"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-row p-10 gap-6">
        {/* Left Side - User Info */}
        <div className="relative">
          <div className="absolute inset-0 rounded-lg "></div>
          <div className="bg-black p-4 rounded-lg shadow-[0_0_10px_3px_rgba(255,255,255,0.5)] w-40 text-center relative z-10">
            <h2 className="text-sm font-semibold">Welcome!</h2>
            <p className="text-pink-400 font-bold text-sm">{user.name}</p>
          </div>
        </div>

        {/* Middle Section - Stock Data and Chart */}
        <div className="relative flex-1 flex flex-col items-center">
          <div className="absolute inset-0 rounded-lg"></div>
          <div className="bg-black p-6 rounded-lg shadow-[0_0_10px_3px_rgba(255,255,255,0.5)] flex-1 flex flex-row items-center justify-center gap-8 relative z-10">
            {/* Left Section - Investment Details */}
            <div className="space-y-4 flex flex-col items-start">
              <button className="bg-gray-700 p-4 rounded w-64 text-center text-sm">
                Total Investment: {stockData.totalInvestments}
              </button>
              <button className="bg-gray-700 p-4 rounded w-64 text-center text-sm">
                Current Value: ${stockData.currentValue}
              </button>
              <button className="bg-gray-700 p-4 rounded w-64 text-center text-sm">
                Profit/Loss %: {stockData.profitLoss}%
              </button>
            </div>

            {/* Right Section - Pie Chart */}
            <div className="w-120 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    startAngle={90} // Adjust angles to show data only at the ends
                    endAngle={-270}
                    innerRadius={60} // Creates hollow center
                    outerRadius={80}
                    fill="#8884d8"
                    label={({ name, x, y }) => {
                      const labelMap = {
                        investment: "Total Investment",
                        current: "Current Value",
                        profit: "Profit/Loss",
                      };

                      return (
                        <text
                          x={x}
                          y={y}
                          fill="white"
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize="12px"
                          fontWeight="bold"
                        >
                          {labelMap[name] || name}{" "}
                        </text>
                      );
                    }}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
