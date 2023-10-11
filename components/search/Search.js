import { useState } from "react";

const Search = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    // Call the onSearch callback with the searchQuery as an argument
    onSearch(searchQuery);
  };

  return (
    <div className="flex items-center space-x-2 w-full py-5">
      <input
        type="text"
        placeholder="Search..."
        className="border rounded-md p-2"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-3 py-2 rounded-md"
      >
        Search
      </button>
    </div>
  );
};

export default Search;
