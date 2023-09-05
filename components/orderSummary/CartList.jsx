"use client"; // This is a client component
import React, { useMemo } from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import OrderSuccessModal from "../../components/orderSuccessModal/OrderSuccessModal";

const OrderSummaryList = ({ cartListData , customer_id, customerDetails }) => {
    const router = useRouter();
  const rupeesSymbol = "₹";
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOrder = () => {
    // Perform your order logic here
    // When the order is successful, set isModalOpen to true
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    router.push('/Home');
  };



  console.log("cartListData", cartListData);

  useEffect(() => {
    calculateOrderSummary();
  }, [cartListData]);

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

      <h2 className="text-sm text-gray-600 py-2 text-left">
        {cartListData.length} Item(s)
      </h2>
      <ul>
        {cartListData.map((item, index) => (
          <li key={index} className="flex items-left justify-between mb-2">
            <div className="flex items-left">
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
          onClick={handleOrder}
        >
          Place Order
        </button>{" "}
        <OrderSuccessModal isOpen={isModalOpen} onClose={handleCloseModal} />
      </div>
    </div>
  );
};

export default OrderSummaryList;
