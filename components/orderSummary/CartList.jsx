"use client"; // This is a client component
import React, { useMemo } from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OrderSuccessModal from "../../components/orderSuccessModal/OrderSuccessModal";
import axios from "axios";
const OrderSummaryList = ({
  cartListData,
  customerId,
  customerData,
  shippingAddress,
  errors,
  
}) => {
  const router = useRouter();
  const rupeesSymbol = "₹";


  useEffect(() => {
    calculateOrderSummary();
  }, [cartListData]);

 
  const handlePayment = async (PAToken) => {
    const paymentRequest1 = {
      payment: {
        instrument: {
          type: "card",

          cardholder_name: "success",

          number: "4111111111111111",

          expiry_month: 4,

          expiry_year: 2030,

          verification_value: "422",
        },

        payment_method_id: "test",
      },
    };

    let paymentRequest3 = {
      payment: {
        instrument: {},

        payment_method_id: "cod",

        amount: 81,

        currency_code: "INR",
      },
    };

    let paymentRequest = {
      payment: {
        instrument: {
          type: "card",

          number: "4111111111111111",

          cardholder_name: "BP",

          expiry_month: 12,

          expiry_year: 2020,

          verification_value: "411",
        },

        payment_method_id: "authorizenet.card",

        save_instrument: true,
      },
    };

    const paymentRequest2 = {
      payment: {
        instrument: {
          type: "card",

          number: "4111111111111111",

          cardholder_name: "success",

          expiry_month: 12,

          expiry_year: 2024,

          verification_value: "123",
        },

        payment_method_id: "testgateway.card",

        save_instrument: false,
      },
    };

   
    let header = {
      Authorization: `PAT ${PAToken}`,
      Accept: "application/vnd.bc.v1+json",
      "X-Auth-Token": "w3l5vxyu02pzjtye8kod85xggujddm",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept, Authorization",
      "Access-Control-Request-Method": "GET, POST, DELETE, PUT, OPTIONS",
    };

    console.log("Header", header);

    try {
      const res = await fetch(
        `https://payments.bigcommerce.com/stores/3bkf9t8exj/payments`,

        {
          method: "POST",

          mode: "no-cors",

          headers: header,

          body: paymentRequest2,
        }
      );

      const data = await res.json();

      console.log(data);

      console.log("payment Resssponse", response.data);

      sessionStorage.removeItem("cart_id");

      setIsModalOpen(true);
    } catch (err) {
      console.log(err);
    }

      };

  const handlePayment1 = async (PAToken) => {
    const paymentRequest = {
      payment: {
        instrument: {
          type: "card",

          cardholder_name: "success",

          number: "4111111111111111",

          expiry_month: 4,

          expiry_year: 2030,

          verification_value: "422",
        },

        payment_method_id: "card",
      },
    };

    console.log("paymen", paymentRequest);

    const result = await axios
      .post("../api/payment", paymentRequest)
      .then(function (response) {
        console.log("payment Response", response.data);

        sessionStorage.removeItem("cart_id");
        setIsModalOpen(true);
      })
      .catch(function (error) {
        console.log(error);
        //setIsError(true);
      });
  };

  console.log("cartListData", cartListData);

  const calculateOrderSummary = () => {
    const subtotal = cartListData.reduce(
      (acc, item) => acc + item.sale_price * item.quantity,
      0
    );

    const shippingCharge = 50;
    const total = +subtotal.toFixed(2);

    document.getElementById("subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("shipping").textContent = shippingCharge.toFixed(2);
    document.getElementById("total").textContent = (
      shippingCharge + total
    ).toFixed(2);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="font-semibold mb-4 text-base text-center">
        Order Summary
      </h2>
      <div className="border-t border-gray-300 my-4"></div>
      <li className="flex items-center justify-between py-2">
        <div className="text-left">
          <h2 className="text-sm text-gray-600 py-2 text-left">
            {cartListData.length} Item(s)
          </h2>
        </div>
        <div className="text-right">
          <button
            className="text-blue-500 hover:underline"
            onClick={() => router.back()}
          >
            Edit Cart
          </button>
        </div>
      </li>
      <ul>
        {cartListData.map((item, index) => (
          <li key={index} className="flex items-left justify-between mb-2">
            <div className="flex items-center">
              <div className="ml-4">
                <img
                  src={item?.image_url}
                  alt={`Product Image for ${item.name}`}
                  className="w-12 h-12"
                />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">
                  {item.quantity} x {item.name}
                </p>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">
                  {rupeesSymbol}
                  {item.sale_price.toFixed(2)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="border-t border-gray-300 my-4"></div>
      <ul>
        <li className="flex items-center justify-between py-2">
          <div className="text-left">
            <p className="text-sm text-gray-600">SubTotal :</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              {rupeesSymbol} <span id="subtotal">0</span>
            </p>
          </div>
        </li>
        <li className="flex items-center justify-between py-2">
          <div className="text-left">
            <p className="text-sm text-gray-600">Shipping :</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              {rupeesSymbol} <span id="shipping">0</span>
            </p>
          </div>
        </li>
        <div className="border-t border-gray-300 my-4"></div>
        <li className="flex items-center justify-between py-2">
          <div className="text-left">
            <p className="text-sm text-gray-600">Total :</p>
          </div>
          <div className="text-right">
            <p className="text-xl text-black-600 font-semibold">
              {rupeesSymbol} <span id="total">0</span>
            </p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default OrderSummaryList;
