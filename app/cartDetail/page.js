"use client"; // This is a client component
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

import { useSearchParams } from "next/navigation";

const CartPage = () => {
  const searchParams = useSearchParams();
  const cartId = searchParams.get("cartId");

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    getCartDetails();
  }, []);

  const getCartDetails = async () => {
    const request = {
      id: cartId,
    };
    const result = await axios
      .post("../api/getCart", request)
      .then(function (response) {
        console.log("Success");
        console.log("cart", response.data);
        setCartItems(response.data.data.line_items.physical_items);
        calculateOrderSummary(response.data.data.line_items.physical_items);
      })
      .catch(function (error) {
        console.log(error);
        //setIsError(true);
      });
  };

  const calculateOrderSummary = (data) => {
    const subtotal = data.reduce(
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
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-normal mb-4 text-center py-1">
        Your Cart {cartItems.length} Item(s)
      </h1>
      <table class="w-full border">
        <thead>
          <tr class="bg-gray-200">
            <th class="py-2 px-4 border text-left">Product</th>
            <th class="py-2 px-4 bordert  text-left">Price</th>
            <th class="py-2 px-4 border text-left">Quantity</th>
            <th class="py-2 px-4 border text-left">Total</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id} class="border-b">
              <td class="px-4 py-2">
                <div class="flex items-center">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    class="w-12 h-12 object-contain mr-4"
                  />
                  <span>{item.name}</span>
                </div>
              </td>
              <td class="px-4 py-2">₹&nbsp;{item.sale_price}</td>
              <td class="px-4 py-2">{item.quantity}</td>
              <td class="px-4 py-2">
                ₹&nbsp;{item.sale_price * item.quantity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div class="mt-4  text-right py-2 px-20">
        <p class="font-semibold">
          Subtotal : <span id="subtotal">0</span>
        </p>
        <p class="font-semibold">
          Shipping : <span id="shipping">0</span>
        </p>

        <p class="font-semibold">
          Grand Total : <span id="total">0</span>
        </p>
      </div>
      <div class="mt-4 text-right px-20">
        <Link
          href="/checkout"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
