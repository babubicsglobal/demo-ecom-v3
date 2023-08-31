"use client";
import React from "react";
import { useContext, useState, useEffect } from "react";
import { CounterContext } from "./../../app/context/commerceProduct";

const BannerPage = () => {
  const cfulFilterData = useContext(CounterContext);

  const [ProductImage, setProductImage] = useState([]);

  const getProductImage = async () => {
    for (let i = 0; i < cfulFilterData?.length; i++) {
      let allProductValue =
        cfulFilterData[i]?.commerceItem?.images[i]?.url_standard;
      setProductImage(allProductValue);
      console.log("allProductValue", allProductValue);
    }
  };

  useEffect(() => {
    getProductImage();
  }, [cfulFilterData]);

  //   const firstImage = cfulFilterData?.commerceItem?.images[0]?.url_standard;

  console.log("contextData", cfulFilterData);

  console.log("ProductImage", ProductImage);

  return (
    <section className="w-full h-screen gradient-box overflow-hidden">
      <div className="flex h-full items-center">
        <div className="w-2/5">
          <img src={ProductImage} className="" alt="Image alt text" />
        </div>
        <div className="w-3/5">
          <img
            src={cfulFilterData[0]?.commerceItem?.images[1]?.url_standard}
            className="object-cover w-2/3 h-4/6"
            alt="Image alt text"
          />
        </div>
      </div>
    </section>
  );
};

export default BannerPage;
