import React from "react";
import { useState, useEffect, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import AddStockForm from "../components/AddStockForm";
import { useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { useParams } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";

const COLORS = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#FF33A8",
  "#A833FF",
  "#FF8C33",
  "#33FFF4",
  "#8D33FF",
  "#FFC300",
  "#00A8FF",
  "#FF5733",
  "#C70039",
  "#581845",
  "#009688",
];

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

const Home = () => {
  const { username, password } = useParams();
  const VITE_ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;

  const [investments, setInvestments] = useState([]);
  const [portfolioSummary, setPortfolioSummary] = useState({
    totalPrice: 0,
    totalCompanies: 0,
    totalStocks: 0,
  });
  const [showForm, setShowForm] = useState(false);
  const [stocks, setStocks] = useState([]); // Store stock data
  const [investmentDistributionData, setInvestmentDistributionData] = useState(
    []
  );
  const [calculatingInvestmentValue, setCalculatingInvestmentValue] =
    useState(true);

  const navigate = useNavigate();
  const axiosInstance = useAxios();

  const companyLookup = useMemo(() => {
    return stocks.reduce((acc, company) => {
      acc[company.id] = company.name;
      return acc;
    }, {});
  }, [stocks]);

  const companySymbols = stocks.reduce((acc, stock) => {
    acc[stock.id] = stock.symbol;
    return acc;
  }, {});

  const fetchLiveStockPrices = async (symbols) => {
    const API_KEY = VITE_ALPHA_VANTAGE_API_KEY;
    const livePrices = {};
    try {
      for (const symbol of symbols) {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data["Global Quote"] && data["Global Quote"]["05. price"]) {
          livePrices[symbol] = parseFloat(
            data["Global Quote"]["05. price"]
          ).toFixed(2);
        } else {
          livePrices[symbol] = null; // Handle missing data
        }
      }
      return livePrices;
    } catch (error) {
      console.error("Error fetching live stock prices:", error);
      return {};
    }
  };

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
        showError(
          "Invalid credentials or network issue! Please Login again..."
        );
      }
    };

    const fetchPortfolio = async () => {
      try {
        const response = await axiosInstance.get("/investments", {
          auth: {
            username,
            password,
          },
        });
        setInvestments(response.data);
      } catch (error) {
        console.error("Error fetching portfolio", error);
      }
    };

    fetchStocks(); // Automatically fetch stocks on mount
    fetchPortfolio();
  }, [showForm]);

  useEffect(() => {
    if (investments.length > 0) {
      const calculatePortfolioSummary = (investments) => {
        const totalPrice = investments.reduce(
          (sum, inv) => sum + inv.total_price,
          0
        );
        const totalCompanies = new Set(investments.map((inv) => inv.company))
          .size;
        const totalStocks = investments.reduce(
          (sum, inv) => sum + inv.stock_unit,
          0
        );

        return { totalPrice, totalCompanies, totalStocks };
      };

      const updateInvestmentDistributionData = async () => {
        // Step 1: Create a mapping of company ID -> Company Name
        const companyMap = Object.fromEntries(
          stocks.map((stock) => [stock.id, stock.name])
        );

        // Step 2: Get unique symbols from investments
        const symbols = [
          ...new Set(investments.map((inv) => companySymbols[inv.company])),
        ].filter(Boolean);

        // Fetch live stock prices
        const livePrices = await fetchLiveStockPrices(symbols);

        // Step 3: Aggregate investments by company
        const investmentMap = {};

        investments.forEach((inv) => {
          const companyId = inv.company;
          const companyName = companyMap[companyId] || `Company ${companyId}`; // Use company name or fallback
          const symbol = companySymbols[companyId];
          const livePrice = livePrices[symbol] || inv.base_price; // Fallback to base price

          if (!investmentMap[companyId]) {
            investmentMap[companyId] = {
              name: companyName, // Use full company name
              value: 0,
            };
          }

          investmentMap[companyId].value += livePrice * inv.stock_unit; // Sum the values
        });

        // Step 4: Convert aggregated data to an array
        const updatedData = Object.values(investmentMap);

        setInvestmentDistributionData(updatedData);
        setCalculatingInvestmentValue(false);
      };

      setPortfolioSummary(calculatePortfolioSummary(investments));
      updateInvestmentDistributionData();
    }
  }, [investments]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove JWT token
    navigate("/login"); // Redirect to login page
  };

  const user = { name: username };

  const data = investments;

  const aggregateData = (data, key) => {
    const aggregated = {};

    data.forEach((item) => {
      const companyName =
        companyLookup[item.company] || `Company ${item.company}`;

      if (!aggregated[companyName]) {
        aggregated[companyName] = 0;
      }

      aggregated[companyName] += item[key];
    });

    return Object.keys(aggregated).map((name) => ({
      name,
      value: aggregated[name],
    }));
  };

  const stockDistributionData = aggregateData(data, "stock_unit");

  // const investmentDistributionData = aggregateData(data, "total_price");

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Format value based on label type
      const formattedValue =
        label === "Investments"
          ? `$${payload[0].value}` // Add $ before value
          : `${payload[0].value} stocks`; // Add "units" after value

      return (
        <div className="bg-white p-2 rounded shadow-md text-black text-sm">
          <p className="font-bold">{payload[0].name}</p>
          <p>
            {label}: <span className="font-semibold">{formattedValue}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const generateColors = (data) => {
    const colorMap = {};
    let colorIndex = 0;

    data.forEach((entry) => {
      const companyKey = entry.name; // Use company name as key
      if (!colorMap[companyKey]) {
        colorMap[companyKey] = COLORS[colorIndex % COLORS.length];
        colorIndex++;
      }
    });

    return colorMap;
  };

  const companyColors = useMemo(() => {
    return generateColors([
      ...stockDistributionData,
      ...investmentDistributionData,
    ]);
  }, [stockDistributionData, investmentDistributionData]);

  return (
    <div className="max-w-screen w-full bg-zinc-800 text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-center items-center p-4 text-lg space-x-10 relative">
        <div className="flex-1 flex justify-center space-x-10">
          <a
            href="#"
            className="bg-gray-700 px-4 py-2 rounded-lg text-white hover:bg-gray-600"
          >
            Your Investments
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
            <AddStockForm
              stocks={stocks}
              username={username}
              password={password}
              onClose={() => setShowForm(false)}
            />
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
      <div className="flex flex-col md:flex-row items-center md:items-start p-10 gap-6">
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
            <div className="space-y-4 flex flex-col items-center">
              <button className="bg-gray-700 p-4 rounded w-64 text-center text-sm">
                Total Value: ${portfolioSummary.totalPrice}
              </button>
              <button className="bg-gray-700 p-4 rounded w-64 text-center text-sm">
                Total Companies: {portfolioSummary.totalCompanies}
              </button>
              <button className="bg-gray-700 p-4 rounded w-64 text-center text-sm">
                Total Stocks: {portfolioSummary.totalStocks}
              </button>
              <div className="flex flex-col md:flex-row gap-12">
                {/* Stocks Distribution Pie Chart */}
                <div className="flex flex-col items-center mt-10">
                  <h3 className="text-white text-sm font-semibold ">
                    Stocks Distribution by Company
                  </h3>
                  <div className="w-60 h-60 relative z-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stockDistributionData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={6}
                          labelLine={false}
                        >
                          {stockDistributionData.map((entry) => {
                            return (
                              <Cell
                                key={entry.name}
                                fill={companyColors[entry.name] || "#8884d8"}
                              />
                            );
                          })}
                        </Pie>
                        <Tooltip
                          content={(tooltipProps) => (
                            <CustomTooltip {...tooltipProps} label="Stocks" />
                          )}
                          wrapperStyle={{ zIndex: 99999 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Total Investment Value Pie Chart */}
                <div className="flex flex-col items-center mt-10">
                  <h3 className="text-white text-sm font-semibold">
                    Investment Value by Company
                  </h3>
                  <div className="w-60 h-60 relative text-sm">
                    <ResponsiveContainer width="100%" height="100%">
                      {calculatingInvestmentValue ? (
                        <div className="mt-25">
                          Loading Current Investment Value (or) No Investment
                          Found
                        </div>
                      ) : (
                        <PieChart>
                          <Pie
                            data={investmentDistributionData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={6}
                            labelLine={false}
                          >
                            {investmentDistributionData.map((entry, index) => {
                              return (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={companyColors[entry.name] || "#8884d8"}
                                />
                              );
                            })}
                          </Pie>
                          <Tooltip
                            content={(tooltipProps) => (
                              <CustomTooltip
                                {...tooltipProps}
                                label="Investments"
                              />
                            )}
                            wrapperStyle={{ zIndex: 99999 }}
                          />
                        </PieChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Home;
