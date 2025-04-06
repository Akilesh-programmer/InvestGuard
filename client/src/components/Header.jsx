import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import AddStockForm from "./AddStockForm";

import InvestmentsModal from "./InvestmentsModal";

const Header = ({
  stocks,
  investments,
  investmentDistributionData,
  username,
  password,
  showForm,
  setShowForm,
}) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isInvestmentsModalOpen, setIsInvestmentsModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove JWT token
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="p-4 text-lg bg-gray-800 text-white relative">
      <div className="flex justify-between items-center">
        {/* Logo or Title */}
        <h1 className="text-2xl font-bold">InvestGuard</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-10">
          <button
            className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600"
            onClick={() => setIsInvestmentsModalOpen(true)}
          >
            Your Investments
          </button>
          <InvestmentsModal
            isOpen={isInvestmentsModalOpen}
            onClose={() => setIsInvestmentsModalOpen(false)}
            investments={investments}
            investmentDistributionData={investmentDistributionData}
            stocks={stocks}
          />
          <a
            href="#"
            className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Notifications
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 right-4 bg-gray-500 shadow-lg rounded-lg w-64 flex flex-col items-start space-y-2 p-4 md:hidden">
          <button
            className="bg-gray-700 px-4 py-2 w-full rounded-lg hover:bg-gray-600"
            onClick={() => setIsInvestmentsModalOpen(true)}
          >
            Your Investments
          </button>
          <InvestmentsModal
            isOpen={isInvestmentsModalOpen}
            onClose={() => setIsInvestmentsModalOpen(false)}
            investments={investments}
            investmentDistributionData={investmentDistributionData}
            stocks={stocks}
          />
          <button
            className="bg-gray-700 px-4 py-2 w-full rounded-lg hover:bg-gray-600"
            onClick={() => setIsInvestmentsModalOpen(true)}
          >
            Notifications
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex flex-col md:flex-row md:mt-0 md:absolute md:right-4 md:items-center md:space-x-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 px-4 py-2 my-6 justify-center rounded-lg text-lg flex items-center space-x-2 hover:bg-green-600"
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
          className="bg-black text-red-400 px-4 py-2 rounded-lg text-lg hover:bg-gray-900"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Header;
