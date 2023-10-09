import React, { useState } from "react";

const PriceFilter = ({ minPrice, maxPrice, onFilterChange }) => {
  const [min, setMin] = useState(minPrice);
  const [max, setMax] = useState(maxPrice);

  const handleMinChange = (e) => {
    const newMin = parseFloat(e.target.value);
    console.log("newMin", newMin);
    setMin(newMin);
  };

  const handleMaxChange = (e) => {
    const newMax = parseFloat(e.target.value);
    console.log("newMax", newMax);
    setMax(newMax);
  };

  const handleFilterClick = () => {
    console.log("max", max);
    onFilterChange({ min, max });
  };

  return (
    <div>
      <label className="block font-semibold mb-1">Price Range:</label>
      <div className="flex items-center space-x-4">
        <input
          type="number"
          value={min}
          onChange={handleMinChange}
          placeholder="Min"
          className="border border-gray-300 px-2 py-1 rounded"
        />
        <span className="text-gray-500">to</span>
        <input
          type="number"
          value={max}
          onChange={handleMaxChange}
          placeholder="Max"
          className="border border-gray-300 px-2 py-1 rounded"
        />
        <button
          onClick={handleFilterClick}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default PriceFilter;
