"use client";
import React from "react";
import { useContext, useState, useEffect } from "react";
import { CounterContext } from "./../../app/context/commerceProduct";
import GlobalConfig from "../../app/globalConfig/config";

const BannerPage = () => {
  const cfulFilterData = useContext(CounterContext);
  console.log("contextData", cfulFilterData);

  return (
    <section className="w-full h-screen gradient-box overflow-hidden">
      <div className="flex h-full items-center">
        {cfulFilterData.map((item, index) => (
          <div key={index} className="w-3/5">
            <img
              src={item.commerceItem?.images[0]?.url_standard}
              className="object-cover w-2/3 h-4/6"
              alt="Image alt text"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BannerPage;
