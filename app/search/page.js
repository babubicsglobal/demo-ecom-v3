"use client"; // This is a client component
import React from "react";
import { useEffect, useState } from "react";
import { client } from "./../../lib/contentful/client";
import PageListCards from "../../components/listingPage/PageListCards";
import axios from "axios";
import Search from "../../components/search/Search";
import PriceFilter from "../../components/filter/PriceFilter";
import SortByDropdown from "../../components/filter/sortByDropdown";
import Filter from "../../components/filter/filter";

const SearchProductsPage = ({ params }) => {
  console.log("params", params);

  const [commerceData, setCommerceData] = useState([]);
  const [cfulData, setCfulData] = useState([]);
  const [cfulFilterData, setCfulFilterData] = useState([]);
  const [mainData, setMainData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const options = [
    { value: "featured", label: "Featured Items" },
    { value: "newest", label: "Newest Items" },
    // { value: 'bestselling', label: 'Best Selling' },
    { value: "alphaasc", label: "A to Z" },
    { value: "alphadesc", label: "Z to A" },
    { value: "avgcustomerreview", label: "By Review" },
    { value: "priceasc", label: "Price: Ascending" },
    { value: "pricedesc", label: "Price: Descending" },
    //// { value: 'relevance', label: 'Relevance' },
  ];
  const [filter, setFilter] = useState({ min: 0, max: 100 }); // Set initial filter values
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]); // Initialize with the default option
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);

    if (option.value === "featured") {
      const items = mainData.filter(
        (item) => item?.commerceItem?.is_featured === true
      );

      setCfulFilterData(items);
    } else if (option.value === "newest") {
      const items = mainData.filter(
        (item) => item?.commerceItem?.condition.toLowerCase() === "new"
      );
      setCfulFilterData(items);
    } else if (option.value === "alphaasc") {
      const sortedData = mainData.sort((a, b) =>
        a.commerceItem.name.localeCompare(b.commerceItem.name)
      );

      setCfulFilterData(sortedData);
    } else if (option.value === "alphadesc") {
      const items = mainData.sort((a, b) =>
        b.commerceItem.name.localeCompare(a.commerceItem.name)
      );
      setCfulFilterData(items);
    } else if (option.value === "priceasc") {
      const item = mainData.sort(
        (a, b) =>
          parseFloat(a.commerceItem.sale_price) -
          parseFloat(b.commerceItem.sale_price)
      );

      setCfulFilterData(item);
    } else if (option.value === "pricedesc") {
      const items = mainData.sort(
        (a, b) =>
          parseFloat(b.commerceItem.sale_price) -
          parseFloat(a.commerceItem.sale_price)
      );

      setCfulFilterData(items);
    } else if (option.value === "avgcustomerreview") {
      const items = mainData.sort(
        (a, b) =>
          parseFloat(b.commerceItem.reviews_count) -
          parseFloat(a.commerceItem.reviews_count)
      );

      setCfulFilterData(items);
    }
  };

  const togglePopover = () => {
    setPopoverOpen(!isPopoverOpen);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);

    const request = {
      from: "filter",
      minPrice: newFilter.min,
      maxPrice: newFilter.max,
    };

    getBigcomProducts(request);
    // setPopoverOpen(!isPopoverOpen);
  };

  const handleSearch = (query) => {
    console.log("query", query);
    const request = {
      searchKey: query,
      from: "search",
    };
    getBigcomProducts(request);
  };

  const getBigcomProducts = async (request) => {
    const result = await axios
      .post("../api/searchFilter", request)
      .then(function (response) {
        console.log("res filter", response);
        setCommerceData(response.data.data);
        getCommerceProduct(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getCommerceProduct = async (commerceData) => {
    const response = await client.getEntries({ content_type: "product" });
    console.log("contentful products", response.items);
    setCfulData(response.items);
    getUpdatedCategory(response.items, commerceData);
  };

  const getUpdatedCategory = (data, commerceData) => {
    console.log("map data", data);
    console.log("map commerceData", commerceData);
    const newProducts = data?.map((product) => {
      const filteredProduct = commerceData?.find(
        (item) => product?.fields?.bigcommerceProduct === item?.sku
      );
      console.log("map product", filteredProduct);
      product.commerceItem = filteredProduct;
      return product;
    });
    const updatedBigcomProducts = newProducts.filter(
      (item) => item.commerceItem
    );

    console.log("Produts", updatedBigcomProducts);
    setCfulFilterData(updatedBigcomProducts);
    setMainData(updatedBigcomProducts);
  };

  useEffect(() => {
    const request = {
      searchKey: "",
      from: "search",
    };
    getBigcomProducts(request);
  }, []);

  return (
    <div className="px-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
        <div className="col-span-1 md:col-span-1 lg:col-span-1">
          {" "}
          <Search onSearch={handleSearch} />
        </div>
        <div className="col-span-1 md:col-span-1 lg:col-span-1">
          <SortByDropdown
            options={options}
            selectedOption={selectedOption}
            onSelect={handleSelect}
            toggleDropdown={toggleDropdown}
            isOpen={isOpen}
          />
        </div>
        <Filter
          onClick={togglePopover}
          handleFilterChange={handleFilterChange}
          isPopoverOpen={isPopoverOpen}
        />
      </div>
      <PageListCards bigCommerceData={cfulFilterData}></PageListCards>
    </div>
  );
};

export default SearchProductsPage;
