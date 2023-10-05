"use client"; // This is a client component
import React from "react";
import { useEffect, useState } from "react";
import { client } from "./../../lib/contentful/client";
import PageListCards from "../../components/listingPage/PageListCards";
import axios from "axios";
import Search from "../../components/search/Search"

const SearchProductsPage = ({ params }) => {
  console.log("params", params);

  const [commerceData, setCommerceData] = useState([]);
  const [cfulData, setCfulData] = useState([]);
  const [cfulFilterData, setCfulFilterData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query) => {
    console.log("query",query)
    getBigcomProducts(query);
  };

  const getBigcomProducts = async (query) => {
    const request = {
        searchKey: query,
      };
      console.log("ppps",request)
      const result = await axios
        .post("../api/searchFilter", request)
        .then(function (response) {
            console.log("res filter",response)
            setCommerceData(response.data.data);
        })
        .catch(function (error) {
          console.log(error);
        
        });
   
  };
  const getCommerceProduct = async () => {
    const response = await client.getEntries({ content_type: "product" });
    // console.log("contentful products", response.items);
    setCfulData(response.items);
  };

  const getUpdatedCategory = () => {
    const newProducts = cfulData?.map((product) => {
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
    setCfulFilterData(updatedBigcomProducts);
  };

  useEffect(() => {
    getUpdatedCategory();
  }, [cfulData, commerceData]);

  useEffect(() => {
    getBigcomProducts("");
    getCommerceProduct();
  }, []);

  console.log("cfulData", cfulData);
  console.log("commerceData", commerceData);
  console.log("cfulFilterData", cfulFilterData);

  return (
    <div>
     <Search onSearch={handleSearch} />
      <PageListCards bigCommerceData={cfulFilterData}></PageListCards>
    </div>
  );
};

export default SearchProductsPage;
