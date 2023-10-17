"use client"; // This is a client component
import React, { useMemo } from "react";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CustomerAPI } from "./../../api/customer/getCustomerAPI";
import { Linden_Hill } from "next/font/google";
import GlobalConfig from "./../../globalConfig/config";
import { Rating } from "react-simple-star-rating";
import { calculateDiscount } from "../../utils/calculateDiscountPercentage";

function ProductDetailpage({ params }) {
  console.log("params", params);
  const router = useRouter();

  const [productList, setproductList] = useState([]);
  const [sessionItem, setsessionItem] = useState("");
  const [productDetail, setproductDetail] = useState([]);

  const [count, setCount] = useState(1);
  const [rating, setRating] = useState("");
  const [discount, setDiscount] = useState(0);

  //   const getProductItemKey = async () => {
  //     setproductItem(cfulFilterData);
  //   };

  const inc = (event) => {
    console.log("btn", event.target);
    checkStock(count + 1, "inc");
  };

  const dec = () => {
    setCount(Math.max(1, count - 1));
  };

  const CounterDisplay = ({ count }) => {
    return <div className="px-3 py-1">{count}</div>;
  };
  const getBigcomProducts = async () => {
    const result = await axios.get("../api/bigcomProducts");
    // console.log("bigcommerce products", result);
    setproductDetail(result.data.data);
  };

  function checkStock(quantity, from) {
    // if (productList[0]?.order_quantity_maximum >= quantity) {
    if (100 >= quantity) {
      if (productList[0]?.inventory_level < quantity) {
        alert(
          `Low stock for ${productList[0]?.name}. Available Stock ${productList[0]?.inventory_level}`
        );
      } else {
        if (from === "inc") {
          setCount(count + 1);
        } else {
          handleSubmit();
        }
      }
    } else {
      alert(
        `Your are exceeding maximum order quantity of ${productList[0]?.order_quantity_maximum}`
      );
    }
  }

  const getProductBySku = async () => {
    const productSlug = `${params?.item}`;
    console.log("productSlug", productSlug);

    const filteredProduct = productDetail?.filter((item) =>
      productSlug
        ? item?.custom_url?.url.replace(/\//g, "") === productSlug
        : true
    );
    setproductList(filteredProduct);
    if (filteredProduct[0]?.sale_price > 0) {
      let value = calculateDiscount(
        filteredProduct[0]?.price ?? 0,
        filteredProduct[0]?.sale_price ?? 0
      );

      if (!isNaN(value)) {
        console.log("value", value);
        setDiscount(value);
      }
    }

    setRating(
      filteredProduct[0]?.reviews_rating_sum / filteredProduct[0]?.reviews_count
    );
    return filteredProduct;
  };

  const handleSubmit = async () => {
    const cartId = sessionStorage.getItem("cart_id");
    console.log("stored cart id", cartId);

    const line_items = [
      {
        quantity: count,
        product_id: productList[0]?.id,
        variant_id: productList[0]?.variants[0]?.id,
        list_price:
          productList[0]?.sale_price > 0
            ? productList[0]?.sale_price
            : productList[0]?.price,
        name: productList[0]?.name,
        option_selections: [
          {
            option_id: productList[0]?.variants[0]?.option_values[0]?.id,
            option_value:
              productList[0]?.variants[0]?.option_values[0]?.option_id,
            name: productList[0]?.variants[0]?.option_values[0]
              ?.option_display_name,
            value: productList[0]?.variants[0]?.option_values[0]?.label,
          },
        ],
      },
    ];

    if (cartId === null) {
      console.log("create cart");
      const CreateCart = {
        customer_id: sessionItem,
        line_items: line_items,
        channel_id: 1,
        currency: {
          code: "INR",
        },
        locale: "en-US",
      };

      console.log("request CreateCart", CreateCart);
      const result = await axios
        .post("../api/cart", CreateCart)
        .then(function (response) {
          console.log("Success");
          console.log("cart id", response.data);
          sessionStorage.setItem("cart_id", response.data.data.id);

          const destinationURL = `/cartDetail`;
          // const destinationURL = `/cartDetail/${response.data.data.id}`;
          router.push(destinationURL);
          //setIsError(false);
        })
        .catch(function (error) {
          console.log("error,err", error);
          alert("Product does not have sufficient stock");
          //setIsError(true);
        });
    } else {
      console.log("update cart");
      const UpdateCart = {
        cartId: cartId,
        line_items: line_items,
        channel_id: 1,
        currency: {
          code: "INR",
        },
        locale: "en-US",
      };
      console.log("request UpdateCart", UpdateCart);
      const result = await axios
        .post("../api/updateCart", UpdateCart)
        .then(function (response) {
          console.log("Success");
          console.log("cart id", response.data);
          sessionStorage.setItem("cart_id", response.data.data.id);

          const destinationURL = `/cartDetail`;
          //const destinationURL = `/cartDetail/${response.data.data.id}`;
          router.push(destinationURL);
          //setIsError(false);
        })
        .catch(function (error) {
          console.log("error,err", error);
          alert("Product does not have sufficient stock");
          //setIsError(true);
        });
    }
  };

  useEffect(() => {
    getProductBySku();
  }, [productDetail]);

  useEffect(() => {
    // getProductItemKey();

    getBigcomProducts();

    var config = { "Access-Control-Allow-Origin": "*" };
    CustomerAPI(
      config,
      (response) => {
        console.log("Response", response.data.data);
      },
      (err) => {
        //error
        console.log(err);
      }
    );
    setsessionItem(+sessionStorage.getItem("customer_Number"));
  }, []);

  console.log("productDetail", productDetail);
  console.log("productList", productList);
  //console.log("rating", rating);

  console.log("customerID", sessionItem);
  if (productList[0])
    return (
      <section className="text-gray-700 body-font overflow-hidden bg-white">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <img
              alt="ecommerce"
              className="lg:w-1/2 w-full object-cover object-center rounded border border-gray-200"
              src={productList[0]?.images[0]?.url_standard}
            />
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                {productList[0]?.name}
              </h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                {productList[0]?.name}
              </h1>
              {discount > 0 ? (
                <h2 className="text-base title-font text-red-500 tracking-widest pb-2">
                  {discount}
                  {"% OFF"}
                </h2>
              ) : (
                <div></div>
              )}
              <div className="flex mb-4">
                <span className="flex items-center">
                  <div
                    style={{
                      direction: "ltr",
                      fontFamily: "sans-serif",
                      touchAction: "none",
                    }}
                  >
                    <Rating
                      initialValue={rating}
                      allowHover="false"
                      allowFraction="true"
                      readonly="true"
                    />
                  </div>
                  <span className="text-gray-600 ml-3">
                    {productList[0]?.reviews_count} Reviews
                  </span>
                </span>
              </div>
              <div
                className="leading-relaxed text-base"
                dangerouslySetInnerHTML={{
                  __html: productList[0]?.description,
                }}
              ></div>

              {productList[0]?.inventory_level == 0 ? (
                <p className="text-red-600 text-lg py-2">Out of Stock</p>
              ) : productList[0]?.inventory_level <=
                productList[0]?.inventory_warning_level ? (
                <p className="text-red-600 text-sm py-2">
                  Only {productList[0]?.inventory_level} left in stock.. Order
                  Soon!
                </p>
              ) : (
                <div></div>
              )}

              {productList[0]?.inventory_level > 0 ? (
                <div>
                  <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-200 mb-5">
                    <div className="flex ml-6 items-center">
                      <span className="mr-3">Size</span>
                      <div className="relative">
                        <select className="rounded border appearance-none border-gray-400 py-2 focus:outline-none focus:border-red-500 text-base pl-3 pr-10">
                          {productList[0]?.variants.map((item, index) => (
                            <option key={index}>
                              {item.option_values[0]?.label}
                            </option>
                          ))}
                        </select>
                        <span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                          <svg
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 9l6 6 6-6"></path>
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="flex ml-6 items-center">
                      <span className="mr-3">Quantity</span>
                      <div className="relative">
                        <div className="flex">
                          <button
                            onClick={dec}
                            className="inc-btn px-3 rounded border appearance-none border-gray-400 py-1"
                          >
                            -
                          </button>

                          <CounterDisplay count={count} />

                          <button
                            onClick={inc}
                            className="dec-btn px-3 rounded border appearance-none border-gray-400 py-1"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex">
                    <span className="title-font font-medium text-2xl text-gray-900">
                      <div className="price-counter">
                        {productList[0]?.sale_price > 0 ? (
                          <div>
                            <span className="a-price-symbol">₹&nbsp;</span>
                            <span className="text-5xl">
                              {productList[0]?.sale_price}
                            </span>
                            <span>
                              <span className="a-price-symbol">
                                &nbsp;&nbsp;M.R.P&nbsp;
                              </span>

                              <span className="line-through">
                                {productList[0]?.price}
                              </span>
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span className="a-price-symbol">₹&nbsp;</span>
                            <span className="text-5xl">
                              {productList[0]?.price}
                            </span>
                          </div>
                        )}
                      </div>
                    </span>
                    <button
                      onClick={() => checkStock(count, "add")}
                      className="flex ml-auto text-white bg-blue-900 border-0 py-2 px-6 rounded"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex">
                  <span className="title-font font-medium text-2xl text-gray-900">
                    {productList[0]?.sale_price > 0 ? (
                      <div className="price-counter">
                        <div>
                          <span className="a-price-symbol">₹&nbsp;</span>
                          <span className="text-5xl">
                            {productList[0]?.sale_price}
                          </span>
                          <span>
                            <span className="a-price-symbol">
                              &nbsp;&nbsp;M.R.P&nbsp;
                            </span>

                            <span className="line-through">
                              {productList[0]?.price}
                            </span>
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span className="a-price-symbol">₹&nbsp;</span>
                        <span className="text-5xl">
                          {productList[0]?.price}
                        </span>
                      </div>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
}

export default ProductDetailpage;
