"use client"; // This is a client component
import React, { useMemo } from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const PageListCards = ({ bigCommerceData }) => {
  const bigCommerceProducts = useMemo(() => bigCommerceData, [bigCommerceData]);
  console.log("bigCommerceProducts", bigCommerceProducts);

  return (
    <div className="card-box">
      {bigCommerceProducts?.length != 0 && (
        <div className="bicommerce-box">
          <div className="block text-4xl font-extrabold dark:text-white">
            <h1 className="mt-20 mb-20">Bigcommerce Products</h1>
          </div>
          <div className="flex flex-wrap -mx-1 lg:-mx-4">
            {bigCommerceProducts.map((item, index) => (
              <div
                className="my-1 px-1 w-full md:w-1/3 lg:my-4 lg:px-4 lg:w-1/4"
                key={index}
              >
                <article className="overflow-hidden rounded-lg shadow-lg card-list">
                  <Link href={`product/${item?.commerceItem?.custom_url?.url}`}>
                    <img
                      alt="Placeholder"
                      className="block h-72 w-full object-contain"
                      //src={item.fields.productImage[0].fields.file.url}
                      src={item?.commerceItem?.images[0]?.url_standard}
                    />
                  </Link>
                  <div className="card-bodylist bg-primary">
                    <header className="flex justify-between leading-tight p-2 md:p-4 flex-col">
                      <h1 className="text-lg subheading mb-4">
                        <a
                          className="no-underline text-blue-900 font-bold"
                          href=""
                        >
                          {/* {item?.commerceProduct?.masterData?.staged?.name?.en} */}
                          {item?.commerceItem?.name}
                        </a>
                      </h1>
                      <div className="price-counter mb-3">
                        <span>
                          <span className="a-price-symbol">₹&nbsp;</span>

                          {item?.commerceItem?.price}
                        </span>
                        <span>
                          {" "}
                          {<span className="a-price-symbol">M.R.P&nbsp;</span>}
                          {
                            <span className="line-through">
                              {item?.commerceItem?.price}
                            </span>
                          }
                        </span>
                      </div>
                    </header>

                    {/* <footer className="flex items-center justify-between leading-none p-2 md:p-4">
                      <a
                        className="no-underline hover:underline text-white"
                        href=""
                      >
                        See all {item?.commerceItem?.name} products
                      </a>
                    </footer> */}
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PageListCards;
