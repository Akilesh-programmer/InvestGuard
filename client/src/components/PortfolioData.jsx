import React from "react";
import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Loader from "./Loader";

const COLORS = [
  "#33FF57", // green
  "#3357FF", // blue
  "#A833FF", // violet
  "#FF8C33", // orange (safe shade)
  "#33FFF4", // cyan
  "#FFC300", // golden yellow
  "#00A8FF", // light blue
  "#581845", // plum
  "#009688", // teal
  "#FFD700", // gold
  "#40E0D0", // turquoise
  "#8A2BE2", // blue violet
  "#7FFF00", // chartreuse
  "#1E90FF", // dodger blue
  "#ADFF2F", // green yellow
  "#00FF7F", // spring green
  "#6A5ACD", // slate blue
  "#20B2AA", // light sea green
  "#9370DB", // medium purple
  "#3CB371", // medium sea green
];

const PortfolioData = ({
  livePortfolioValue,
  portfolioSummary,
  data,
  stocks,
  investmentDistributionData,
  calculatingInvestmentValue,
  investmentDistributionLoader,
}) => {
  const companyLookup = useMemo(() => {
    return stocks.reduce((acc, company) => {
      acc[company.id] = company.name;
      return acc;
    }, {});
  }, [stocks]);

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

  return (
    <div className="relative flex-1 flex flex-col items-center">
      <div className="absolute inset-0 rounded-lg bg-zinc-800"></div>
      <div className="bg-zinc-900 p-6 rounded-2xl shadow-[0_0_15px_rgba(255,255,255,0.3),inset_2px_2px_5px_rgba(255,255,255,0.05),inset_-2px_-2px_5px_rgba(0,0,0,0.5)] flex-1 flex flex-row items-center justify-center gap-8 relative z-10">
        {/* Left Section - Investment Details */}
        <div className="space-y-4 flex flex-col items-center">
          <button className="bg-zinc-800 text-white text-base font-medium px-4 py-2 w-52 rounded-lg shadow-[inset_1px_1px_3px_rgba(255,255,255,0.05),inset_-1px_-1px_3px_rgba(0,0,0,0.4)] hover:shadow-[0_0_6px_rgba(255,255,255,0.3)] transition-all duration-300">
            Total Value: $
            {livePortfolioValue != 0 ? (
              Math.floor(livePortfolioValue)
            ) : (
              <p>Loading...</p>
            )}
          </button>

          <button className="bg-zinc-800 text-white text-base font-medium px-4 py-2 w-52 rounded-lg shadow-[inset_1px_1px_3px_rgba(255,255,255,0.05),inset_-1px_-1px_3px_rgba(0,0,0,0.4)] hover:shadow-[0_0_6px_rgba(255,255,255,0.3)] transition-all duration-300">
            Total Companies:{" "}
            {portfolioSummary.totalCompanies != 0 ? (
              portfolioSummary.totalCompanies
            ) : (
              <p>Loading...</p>
            )}
          </button>

          <button className="bg-zinc-800 text-white text-base font-medium px-4 py-2 w-52 rounded-lg shadow-[inset_1px_1px_3px_rgba(255,255,255,0.05),inset_-1px_-1px_3px_rgba(0,0,0,0.4)] hover:shadow-[0_0_6px_rgba(255,255,255,0.3)] transition-all duration-300">
            Total Stocks:{" "}
            {portfolioSummary.totalStocks != 0 ? (
              portfolioSummary.totalStocks
            ) : (
              <p>Loading...</p>
            )}
          </button>

          <div className="flex flex-col md:flex-row gap-12">
            {/* Stocks Distribution Pie Chart */}
            <div className="flex flex-col items-center mt-10">
              <h3 className="text-white text-base font-semibold tracking-wide mb-4 text-center">
                Stocks Distribution by Company
              </h3>

              <div className="w-60 h-60 relative z-20">
                {stockDistributionData.length === 0 && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
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
            <div className="flex flex-col items-center mt-0 md:mt-10">
              <h3 className="text-white text-base font-semibold tracking-wide mb-4 text-center">
                Investment Distribution by Company
              </h3>

              <div className="w-60 h-60 relative text-sm">
                {investmentDistributionLoader && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <ResponsiveContainer width="100%" height="100%">
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
                        <CustomTooltip {...tooltipProps} label="Investments" />
                      )}
                      wrapperStyle={{ zIndex: 99999 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioData;
