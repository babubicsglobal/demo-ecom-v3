// components/OrderConfirmation.js

import React from 'react';

const OrderConfirmation = ({orderId,orderTotal, shippingAddress }) => {
  return (
    <div className="bg-white p-4 rounded shadow-lg">
        
            <img
              src="/orderSuccess.png"
              alt="Centered Image"
              className="h-60 w-60" // Adjust the height and width as needed
            />
           
        
      <h1 className="text-2xl font-semibold mb-4">Order Placed, Thank you!</h1>
      <h2 className="text-2xl font-semibold mb-4">Order Confirmation</h2>
      <div className="mb-4">
        <strong>Order ID:</strong> {orderId}
      </div>
      <div className="mb-4">
        <strong>Order Total:</strong> ${orderTotal}
      </div>
      <div className="mb-4">
        <strong>Shipping Address:</strong> {shippingAddress.first_name}{shippingAddress.last_name},
        {shippingAddress.email}
        {shippingAddress.phone}
        {shippingAddress.company}
        {shippingAddress.street_1}
        {shippingAddress.street_2}
        {shippingAddress.city}
        {shippingAddress.state}
        {shippingAddress.country_iso2}
        {shippingAddress.zip}
      </div>
    </div>
  );
};

export default OrderConfirmation;
