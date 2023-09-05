"use client"; // This is a client component
import React, { useMemo } from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import OrderSuccessModal from "../../components/orderSuccessModal/OrderSuccessModal";
import axios from "axios";
const OrderSummaryList = ({ cartListData , customer_id, customerDetails }) => {
    const router = useRouter();
  const rupeesSymbol = "₹";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerId, setCustomerId] = useState("");

  useEffect(() => {
    calculateOrderSummary();
   let customerId = sessionStorage.getItem("customer_Number");
   setCustomerId(customerId);
  }, [cartListData]);


  const handleCloseModal = () => {
    setIsModalOpen(false);
    router.push('/Home');
  };

  const handlePlaceOrder = async () => {

    var productsData = [];

 

    for (let i = 0; i<cartListData.length ; i++){
      let product =  {
        product_id: cartListData[i]?.id,
        quantity: cartListData[i]?.quantity,
        variant_id: cartListData[i]?.variant_id,
      };
      console.log("product",product);
      productsData.push(product);
    }

  

    const billingAddress =  {
      "first_name": "Preethi",
      "last_name": "G",
      "street_1": "Main Street",
      "city": "Austin",
      "state": "Texas",
      "zip": "78751",
      "country": "United States",
      "country_iso2": "US",
      "email": "janedoe@email.com"
    };

   
    const CreateOrder = {
      customer_id: customerId,
      products: productsData,
      billing_address: billingAddress,
    };

    console.log("CreateOrder",CreateOrder);

    const result = await axios
      .post("../api/order", CreateOrder)
      .then(function (response) {
        console.log("Response", response.data);
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
      <div class="border-t border-gray-300 my-4"></div>
      <li class="flex items-center justify-between py-2">
          <div class="text-left">
          <h2 className="text-sm text-gray-600 py-2 text-left">
        {cartListData.length} Item(s)
      </h2>
          </div>
          <div class="text-right">
          <button className="text-blue-500 hover:underline"  onClick={() => router.back()}>Edit Cart</button>
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
      <div class="border-t border-gray-300 my-4"></div>
      <ul>
        <li class="flex items-center justify-between py-2">
          <div class="text-left">
            <p className="text-sm text-gray-600">SubTotal :</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-600">
              {" "}
              {rupeesSymbol} <span id="subtotal">0</span>
            </p>
          </div>
        </li>
        <li class="flex items-center justify-between py-2">
          <div class="text-left">
            <p className="text-sm text-gray-600">Shipping :</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-600">
              {" "}
              {rupeesSymbol} <span id="shipping">0</span>
            </p>
          </div>
        </li>
        <div class="border-t border-gray-300 my-4"></div>
        <li class="flex items-center justify-between py-2">
          <div class="text-left">
            <p className="text-sm text-gray-600">Total :</p>
          </div>
          <div class="text-right">
            <p class="text-xl text-black-600 font-semibold">
              {" "}
              {rupeesSymbol} <span id="total">0</span>
            </p>
          </div>
        </li>
      </ul>

      <div class="text-center">
        {" "}
        <button
          class="bg-blue-500 text-white rounded-full mt-4 py-2 px-6 hover:bg-blue-600 text-center"
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
