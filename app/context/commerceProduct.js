"use client";
import React from "react";
import { useEffect } from "react";
import { createContext, useState } from "react";
import { client } from "./../../lib/contentful/client";
import BannerPage from "./../../components/heroBanner/bannerPage";
import axios from "axios";

export const CounterContext = createContext();

export default function MultiValueContextDemo(props) {
  const [commerceData, setCommerceData] = useState([]);
  const [cfulData, setCfulData] = useState([]);
  const [cfulFilterData, setCfulFilterData] = useState([]);

  const getBigcomProducts = async () => {
    const result = await axios.get("api/bigcomProducts");
    // console.log("bigcommerce products", result);
    setCommerceData(result.data.data);
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
      //console.log("context product", filteredProduct);
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
    getBigcomProducts();
    getCommerceProduct();
  }, []);

  return (
    <CounterContext.Provider value={cfulFilterData}>
      {props.children}
    </CounterContext.Provider>
  );
}
