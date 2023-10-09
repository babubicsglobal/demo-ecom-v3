import React from "react";

const SortByDropdown = ({
  options,
  selectedOption,
  onSelect,
  toggleDropdown,
  isOpen,
}) => {
  return (
    <div className="relative inline-block text-left py-6">
      <div>
        <button
          type="button"
          onClick={toggleDropdown}
          className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring focus:ring-blue-200"
        >
          Sort By: {selectedOption.label}
        </button>
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
          <ul>
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => onSelect(option)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SortByDropdown;
