"use client"; // This is a client component
import React from "react";
import { useEffect, useState } from "react";
import { client } from "./../../lib/contentful/client";
import PageListCards from "../../components/listingPage/PageListCards";
import axios from "axios";

const ProductsCategoryPage = ({ params }) => {
  console.log("params", params);

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
    getBigcomProducts();
    getCommerceProduct();
  }, []);

  console.log("cfulData", cfulData);
  console.log("commerceData", commerceData);
  console.log("cfulFilterData", cfulFilterData);

  return (
    <div>
      <PageListCards bigCommerceData={cfulFilterData}></PageListCards>
    </div>
  );
};

export default ProductsCategoryPage;
