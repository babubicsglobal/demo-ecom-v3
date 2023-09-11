"use client"; // This is a client component
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { TrashIcon } from "@heroicons/react/24/solid";
import { request } from "http";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState("");
  const router = useRouter();
  const rupeesSymbol = "₹ ";

  useEffect(() => {
    setCartId(sessionStorage.getItem("cart_id"));
    getCartDetails(sessionStorage.getItem("cart_id"));
  }, []);

  const inc = (index) => {
    console.log("index", index);
    let count = cartItems[index].quantity;
    updateCartItem(cartItems[index], count + 1);
  };

  const dec = (index) => {
    let count = cartItems[index].quantity;
    if (count === 1) {
      handleDeleteItem(cartItems[index]);
    } else {
      updateCartItem(cartItems[index], count - 1);
    }
  };

  const CounterDisplay = ({ count }) => {
    return <div className="px-3 py-1">{count}</div>;
  };

  const getCartDetails = async (cartId) => {
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

    document.getElementById("subtotal").textContent =
      rupeesSymbol + subtotal.toFixed(2);
    document.getElementById("shipping").textContent =
      rupeesSymbol + shippingCharge.toFixed(2);
    document.getElementById("total").textContent =
      rupeesSymbol + (shippingCharge + total).toFixed(2);
  };

  const goToCheckoutPage = () => {
    router.push("/checkout");
  };

  const handleDeleteItem = (item) => {
    const result = window.confirm(
      "Are you sure, you want to delete this product?"
    );

    if (result) {
      console.log("User clicked OK");
      deleteCartItem(item);
    } else {
      console.log("User clicked Cancel or closed the dialog");
    }
  };

  const deleteCartItem = async (item) => {
    const request = {
      cId: cartId,
      pId: item.id,
    };
    const result = await axios
      .post("../api/deleteCartItem", request)
      .then(function (response) {
        alert("Cart Item deleted successfully!");
        console.log("Success");

        if (cartItems.length === 1) {
          sessionStorage.removeItem("cart_id");
          router.push("/home");
        } else {
          getCartDetails(cartId);
        }
      })
      .catch(function (error) {
        console.log(error);
        //setIsError(true);
      });
  };

  const updateCartItem = async (item, quantity) => {
    const request = {
      cartId: cartId,
      itemId: item.id,
      line_item: {
        quantity: quantity,
        product_id: item.id,
        list_price: item.sale_price,
        variant_id: item.variant_id,
        name: item.name,
        gift_wrapping: {},
      },
      gift_certificates: [],
      custom_items: [],
    };

    const result = await axios
      .post("../api/updateCartItem", request)
      .then(function (response) {
        console.log("Success");
        console.log("cart details", response.data);
        getCartDetails(cartId);
        //setIsError(false);
      })
      .catch(function (error) {
        console.log(error);
        //setIsError(true);
      });
  };

  const clearCartDetails = async () => {
    const request = {
      id: cartId,
    };
    const result = await axios
      .post("../api/clearCart", request)
      .then(function (response) {
        alert("Cart Item deleted successfully!");
        console.log("Success");
        sessionStorage.removeItem("cart_id");
        router.push("/home");
      })
      .catch(function (error) {
        console.log(error);
        //setIsError(true);
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-normal mb-4 text-center py-1">
        Your Cart {cartItems.length} Item(s)
      </h1>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Product</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Total</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item, index) => (
            <tr key={item.id} className="border-b">
              <td className="border px-4 py-2 text-center">
                <div className="flex items-center">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-12 h-12 object-contain mr-4"
                  />
                  <span>{item.name}</span>
                </div>
              </td>
              <td className="border px-4 py-2 text-center">
                <div className="flex justify-center items-center">
                  <button
                    onClick={() => dec(index)}
                    className="inc-btn px-3 rounded border appearance-none border-gray-400 py-1"
                  >
                    -
                  </button>

                  <CounterDisplay count={item.quantity} />

                  <button
                    onClick={() => inc(index)}
                    className="dec-btn px-3 rounded border appearance-none border-gray-400 py-1"
                  >
                    +
                  </button>
                </div>
              </td>
              <td className="border px-4 py-2  text-center">
                ₹&nbsp;{item.sale_price}
              </td>
              <td className="border px-4 py-2  text-center">
                ₹&nbsp;{item.sale_price * item.quantity}
              </td>
              <td className="border px-4 py-2  text-center">
                <button onClick={() => handleDeleteItem(item)}>
                  <TrashIcon className="w-5 h-5 text-red-500" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="ml-auto w-1/4 py-8 text-left">
        <div className="flex justify-between mb-2 px-6">
          <span>Subtotal:</span>
          <span id="subtotal">{rupeesSymbol}0</span>
        </div>
        <div className="flex justify-between mb-2  px-6">
          <span>Shipping:</span>
          <span id="shipping"> {rupeesSymbol}0</span>
        </div>
        <div className="flex justify-between  px-6">
          <span>Grand Total:</span>
          <span id="total"> {rupeesSymbol}0</span>
        </div>
        <div className="mt-4 text-right px-5">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => goToCheckoutPage()}
          >
            Checkout
          </button>
        </div>
        <div className="mt-4 text-right px-5">
          <button
            className="border border-text-black hover:border-black bg-transparent text-gray-500 hover:text-black py-2 px-4 rounded hover:bg-transparent"
            onClick={() => clearCartDetails()}
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
