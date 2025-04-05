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

const COLORS = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#FF33A8",
  "#A833FF",
  "#FF8C33",
  "#33FFF4",
  "#FFC300",
  "#00A8FF",
  "#C70039",
  "#581845",
  "#009688",
  "#FFD700",
  "#40E0D0",
  "#8A2BE2",
  "#FF4500",
  "#7FFF00",
  "#DC143C",
  "#00CED1",
  "#FF1493",
  "#1E90FF",
  "#ADFF2F",
  "#FF69B4",
  "#00FF7F",
  "#6A5ACD",
  "#F08080",
  "#20B2AA",
  "#FFA07A",
  "#9370DB",
  "#3CB371",
];

const PortfolioData = ({
  livePortfolioValue,
  portfolioSummary,
  data,
  stocks,
  investmentDistributionData,
  calculatingInvestmentValue,
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
      <div className="absolute inset-0 rounded-lg"></div>
      <div className="bg-black p-6 rounded-lg shadow-[0_0_10px_3px_rgba(255,255,255,0.5)] flex-1 flex flex-row items-center justify-center gap-8 relative z-10">
        {/* Left Section - Investment Details */}
        <div className="space-y-4 flex flex-col items-center">
          <button className="bg-gray-700 p-4 rounded w-64 text-center text-sm">
            Total Value: $
            {livePortfolioValue != 0
              ? Math.floor(livePortfolioValue)
              : portfolioSummary.totalPrice}
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
                      Loading Current Investment Value (or) No Investment Found
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
  );
};

export default PortfolioData;
