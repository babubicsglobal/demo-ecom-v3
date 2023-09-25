"use client"; // This is a client component
import React, { useMemo } from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OrderSuccessModal from "../../components/orderSuccessModal/OrderSuccessModal";
import axios from "axios";
const OrderSummaryList = ({ cartListData, customerId, customerData }) => {
  const router = useRouter();
  const rupeesSymbol = "₹";
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    calculateOrderSummary();
  }, [cartListData]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    router.push("/home");
  };

  const handlePlaceOrder = async () => {
    var productsData = [];
    for (let i = 0; i < cartListData.length; i++) {
      let product = {
        product_id: cartListData[i]?.product_id,
        quantity: cartListData[i]?.quantity,
        variant_id: cartListData[i]?.variant_id,
      };
      console.log("product", product);
      productsData.push(product);
    }
    const billingAddress = {
      first_name: "preethi",
      last_name: "G",
      street_1: "Main Street",
      city: "Austin",
      state: "Texas",
      zip: "78751",
      country: "United States",
      country_iso2: "US",
      email: "preeth@test.com",
    };
    const CreateOrder = {
      status_id : 0,
      customer_id: customerId,
      products: productsData,
      billing_address: billingAddress,
      
    };

    console.log("CreateOrder", CreateOrder);

    const result = await axios
      .post("../api/createOrder", CreateOrder)
      .then(function (response) {
        console.log("Order Response", response.data);
       // createToken(response.data.id);
        sessionStorage.removeItem("cart_id");
        setIsModalOpen(true);
      })
      .catch(function (error) {
        console.log(error);
        //setIsError(true);
      });
  };


  const createToken = async (orderId) =>  {
    let requestData = {
      "order": {
        "id": orderId,
        "is_recurring": false
      }
    };

    const result = await axios
    .post("../api/createToken", requestData)
    .then(function (response) {
      console.log("Token Resssponse", response.data);
      console.log("PAT",response.data.data.id);
      handlePayment(PAToken);
     
    })
    .catch(function (error) {
      console.log(error);
      //setIsError(true);
    });
  }

  const handlePayment = async (PAToken) => {
   
  const paymentRequest = {
    "payment": {

      "instrument": {

        "type": "card",

        "cardholder_name": "success",

        "number":"4111111111111111",

        "expiry_month": 4,

        "expiry_year": 2030,

        "verification_value":"422",

      },

      "payment_method_id": "card"

    }
  };



  console.log("paymen",paymentRequest);

  
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

  }

 
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
                  {rupeesSymbol}{item.sale_price.toFixed(2)}
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

      <div className="text-center">
       
        <button
          className="bg-blue-500 text-white rounded-full mt-4 py-2 px-6 hover:bg-blue-600 text-center"
          onClick={handlePlaceOrder}
        >
          Place Order
        </button>{" "}
        <OrderSuccessModal isOpen={isModalOpen} onClose={handleCloseModal} />
      </div>
    </div>
  );
};

export default OrderSummaryList;
