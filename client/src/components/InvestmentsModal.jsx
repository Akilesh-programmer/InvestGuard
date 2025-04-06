import React, { useState, useEffect, useMemo } from "react";
import { Dialog } from "@headlessui/react";
import { Pencil, Trash2 } from "lucide-react";

const InvestmentsModal = ({
  isOpen,
  onClose,
  investments,
  investmentDistributionData,
  stocks,
}) => {
  const [editStock, setEditStock] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (
      investments.length > 0 &&
      investmentDistributionData.length > 0 &&
      stocks.length > 0
    ) {
      setLoading(false);
    }
  }, [investments, investmentDistributionData, stocks]);

  const groupedInvestments = useMemo(() => {
    const grouped = {};
    investments.forEach((inv) => {
      const companyId = String(inv.company);
      if (!grouped[companyId]) grouped[companyId] = [];
      grouped[companyId].push(inv);
    });
    return grouped;
  }, [investments]);

  const companyMap = useMemo(() => {
    const map = {};
    Object.entries(groupedInvestments).forEach(([companyId, invs]) => {
      const stock = stocks.find((s) => String(s.id) === companyId);
      const stockName = stock?.name;

      const distMatch = investmentDistributionData.find(
        (dist) => dist.name.toLowerCase() === stockName?.toLowerCase()
      );

      map[companyId] = {
        name: stockName || `Company-${companyId}`,
        value: distMatch?.value,
      };
    });

    return map;
  }, [groupedInvestments, investmentDistributionData, stocks]);

  const calculateSummary = (companyId) => {
    const invs = groupedInvestments[companyId];
    const totalStocks = invs.reduce((sum, inv) => sum + inv.stock_unit, 0);
    const currentValue = companyMap[companyId]?.value;
    const companyName = companyMap[companyId]?.name;
    return { companyName, totalStocks, currentValue };
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-40" />
        <div className="relative z-50 bg-zinc-900 rounded-xl w-full max-w-3xl p-6 shadow-[0_0_20px_2px_rgba(255,255,255,0.2)]">
          <Dialog.Title className="text-xl font-bold text-white mb-4">
            Your Investments
          </Dialog.Title>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {Object.keys(groupedInvestments).map((companyId) => {
                const { companyName, totalStocks, currentValue } =
                  calculateSummary(companyId);

                return (
                  <div
                    key={companyId}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-zinc-800 px-4 py-3 rounded-lg text-white shadow-md"
                  >
                    <div className="w-full">
                      <h3 className="text-lg font-semibold mb-2">
                        {companyName}
                      </h3>
                      <div className="flex flex-wrap sm:flex-nowrap gap-2">
                        <div className="flex items-center bg-zinc-700 px-3 py-2 rounded-md text-sm">
                          <span className="text-gray-300 mr-2">Stocks:</span>
                          <span className="text-white font-medium">
                            {totalStocks}
                          </span>
                        </div>
                        {currentValue !== undefined && (
                          <div className="flex items-center bg-zinc-700 px-3 py-2 rounded-md text-sm">
                            <span className="text-gray-300 mr-2">
                              Current Value:
                            </span>
                            <span className="text-green-400 font-medium">
                              ${Math.floor(currentValue)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 sm:mt-0 sm:ml-4">
                      <button
                        onClick={() => setEditStock(companyId)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-md flex items-center gap-1"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => console.log("Delete", companyId)}
                        className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-md flex items-center gap-1"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 text-right">
            <button
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default InvestmentsModal;
