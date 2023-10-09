import React, { useState } from "react";
import PriceFilter from "../../components/filter/PriceFilter";

const Filter = ({ onClick, isPopoverOpen, handleFilterChange }) => {
  return (
    <div className="relative inline-block">
      {/* Filter Icon */}
      <button onClick={onClick}>
        <img src="/filter.png" alt="filter" width="25" height="25" />
      </button>

      {/* Popover Content */}
      {isPopoverOpen && (
        <div className="absolute z-10 right-20 mt-2  bg-white border rounded-lg shadow-lg py-4 px-4">
          <div className="p-2">
            <PriceFilter
              minPrice={0}
              maxPrice={1000}
              onFilterChange={handleFilterChange}
            />
          </div>
          {/* <div className="p-2">Filter Option 2</div> */}
        </div>
      )}
    </div>
  );
};

export default Filter;
