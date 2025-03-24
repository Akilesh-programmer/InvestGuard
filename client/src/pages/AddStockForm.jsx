import React from "react";

export default function AddStockForm({ onClose }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      companyName: formData.get("companyName"),
      stockUnit: formData.get("stockUnit"),
      basePrice: formData.get("basePrice"),
    };
    console.log("Form Data:", data);
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
          <input
            id="companyName"
            type="text"
            name="companyName"
            placeholder="Enter company name"
            required
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          />

          <label htmlFor="stockUnit" className="font-medium text-gray-700">
            Stock Unit
          </label>
          <input
            id="stockUnit"
            type="number"
            name="stockUnit"
            placeholder="Enter stock units"
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
