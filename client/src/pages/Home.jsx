import React from "react";
import { useState, useEffect } from "react";

import useAxios from "../hooks/useAxios";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import Header from "../components/Header";
import PortfolioData from "../components/PortfolioData";

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
  const [livePortfolioValue, setLivePortfolioValue] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [investments, setInvestments] = useState([]);
  const [investmentDistributionLoader, setInvestmentDistributionLoader] = useState(true);
  const [portfolioSummary, setPortfolioSummary] = useState({
    totalPrice: 0,
    totalCompanies: 0,
    totalStocks: 0,
  });

  const [stocks, setStocks] = useState([]); // Store stock data
  const [investmentDistributionData, setInvestmentDistributionData] = useState(
    []
  );
  const [calculatingInvestmentValue, setCalculatingInvestmentValue] =
    useState(true);

  const axiosInstance = useAxios();

  const companySymbols = stocks.reduce((acc, stock) => {
    acc[stock.id] = stock.symbol;
    return acc;
  }, {});

  const fetchLiveStockPrices = async (symbols) => {
    const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
    const livePrices = {};

    try {
      for (const symbol of symbols) {
        const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.c) {
          livePrices[symbol] = parseFloat(data.c).toFixed(2); // 'c' is current price
        } else {
          livePrices[symbol] = null;
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
    if (
      investments.length > 0 &&
      stocks.length > 0 &&
      Object.keys(companySymbols).length > 0
    ) {
      setInvestmentDistributionLoader(true);
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
        try {
          // Step 1
          const companyMap = Object.fromEntries(
            stocks.map((stock) => [stock.id, stock.name])
          );

          // Step 2
          const symbols = [
            ...new Set(investments.map((inv) => companySymbols[inv.company])),
          ].filter(Boolean);

          const livePrices = await fetchLiveStockPrices(symbols);

          // Step 3
          const investmentMap = {};
          let portfolioTotal = 0;

          investments.forEach((inv) => {
            const companyId = inv.company;
            const companyName = companyMap[companyId] || `Company ${companyId}`;
            const symbol = companySymbols[companyId];
            const livePrice = livePrices[symbol] || inv.base_price;

            if (!investmentMap[companyId]) {
              investmentMap[companyId] = {
                name: companyName,
                value: 0,
              };
            }

            const currentValue = livePrice * inv.stock_unit;
            investmentMap[companyId].value += currentValue;
            portfolioTotal += currentValue;
          });

          // Final setState
          setLivePortfolioValue(portfolioTotal);
          setInvestmentDistributionData(Object.values(investmentMap));
          setCalculatingInvestmentValue(false);
          setInvestmentDistributionLoader(false);
        } catch (err) {
          console.error("🔥 Error updating investment distribution", err);
        }
      };

      setPortfolioSummary(calculatePortfolioSummary(investments));
      updateInvestmentDistributionData();
    }
  }, [investments]);

  const user = { name: username };

  const data = investments;

  return (
    <div className="max-w-screen w-full bg-zinc-800 text-white flex flex-col">
      <Header
        stocks={stocks}
        username={username}
        password={password}
        showForm={showForm}
        setShowForm={setShowForm}
      />

      {/* Main Content */}
      <div className="flex flex-col md:flex-row md:mt-10 items-center md:items-start p-10 gap-6">
        {/* Left Side - User Info */}
        <div className="relative">
          <div className="absolute inset-0 rounded-lg bg-zinc-800"></div>
          <div className="bg-zinc-900 p-4 rounded-2xl w-44 text-center relative z-10 shadow-[0_0_15px_rgba(255,255,255,0.3),inset_2px_2px_4px_rgba(255,255,255,0.05),inset_-2px_-2px_4px_rgba(0,0,0,0.5)]">
            <h2 className="text-lg font-bold text-white">Welcome!</h2>
            <p className="text-pink-400 font-bold text-sm">{user.name}</p>
          </div>
        </div>

        {/* Middle Section - Stock Data and Chart */}
        <PortfolioData
          livePortfolioValue={livePortfolioValue}
          portfolioSummary={portfolioSummary}
          data={data}
          stocks={stocks}
          investmentDistributionData={investmentDistributionData}
          calculatingInvestmentValue={calculatingInvestmentValue}
          investmentDistributionLoader={investmentDistributionLoader}
        />

        <div></div>
      </div>
    </div>
  );
};

export default Home;
