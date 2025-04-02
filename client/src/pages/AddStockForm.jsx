import React from "react";
import { useState } from "react";
import useAxios from "../hooks/useAxios";

import { ToastContainer, toast } from 'react-toastify';

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

export default function AddStockForm({ onClose, stocks, username, password }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [stockUnit, setStockUnit] = useState("");
  const [basePrice, setBasePrice] = useState("");

  const axiosInstance = useAxios();

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const filtered = stocks.filter((company) =>
        company.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCompanies(filtered);
    } else {
      setFilteredCompanies([]);
    }
  };

  const handleSelectCompany = (company) => {
    setSelectedCompany(company);
    setSearchQuery(company.name);
    setFilteredCompanies([]); // Hide dropdown
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCompany) {
      alert("Please select a company from the dropdown.");
      return;
    }

    const stockData = {
      companyId: selectedCompany.id,
      companyName: selectedCompany.name,
      stockUnit,
      basePrice,
    };

    console.log("Stock Data Submitted:", stockData);

    try {
      const response = await axiosInstance.post(
        "investments", 
        {
          stock_unit: stockUnit,
          company: selectedCompany.id, // ID of the selected company
          base_price: basePrice
        },
        {
          auth: {
            username,
            password,
          },
        }
      );
  
      console.log("Stock added successfully:", response.data);
      showSuccess("Stock added successfully!");
      onClose(); // Close the form modal after successful submission
    } catch (error) {
      console.error("Error adding stock", error);
      showError("Failed to add stock! Please try again.");
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-96">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Add Stock Details
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label htmlFor="companyName" className="font-medium text-gray-700">
            Company Name
          </label>
          <div className="relative w-full">
            <input
              id="companyName"
              type="text"
              name="companyName"
              placeholder="Enter company name"
              value={searchQuery}
              onChange={handleSearch}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            {filteredCompanies.length > 0 && (
              <ul className="absolute w-full bg-white text-gray-800 border rounded-md mt-1 shadow-md max-h-40 overflow-y-auto">
                {filteredCompanies.map((company) => (
                  <li
                    key={company.id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSelectCompany(company)}
                  >
                    {company.name}
                  </li> 
                ))}
              </ul>
            )}
          </div>

          <label htmlFor="stockUnit" className="font-medium text-gray-700">
            Stock Unit
          </label>
          <input
            id="stockUnit"
            type="number"
            name="stockUnit"
            placeholder="Enter stock units"
            value={stockUnit}
            onChange={(e) => setStockUnit(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />

          <label htmlFor="basePrice" className="font-medium text-gray-700">
            Base Price
          </label>
          <input
            id="basePrice"
            type="number"
            name="basePrice"
            placeholder="Enter base price"
            step="0.01"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
