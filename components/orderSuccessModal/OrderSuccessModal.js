import React from "react";

const OrderSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-gray-900 bg-opacity-50"></div>
      <div className="fixed inset-0 flex items-center justify-center z-50 ">
        <div className="bg-white rounded-lg p-4 shadow-lg">
          <div class="mx-auto flex items-center justify-center py-2 h-12 w-12 rounded-full bg-purple-100">
            <svg
              class="h-6 w-6 text-purple-600"
              fill="none"
              stroke="blue"
              viewBox="0 0 24 24"
              xmlnx="http://www.w.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <div class="flex justify-center items-center py-2">
            <h2 className="text-xl font-semibold mb-2 ">Order Successful!</h2>
          </div>
          <p className="text-sm text-gray-700 px-10">
            Thank you for your order.
          </p>
          <div class="flex justify-center items-center py-1">
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
            >
              Ok
            </button>
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default OrderSuccessModal;
