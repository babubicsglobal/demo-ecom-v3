import React from "react";
import Link from "next/link";

const CartPage = () => {
  return (
    <div>
      CartPage
      <Link
        href="/checkout"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Checkout
      </Link>
    </div>
  );
};

export default CartPage;
