// components/OrderConfirmation.js

import React from 'react';
import Global from '../../app/globalConfig/config'

const OrderConfirmation = () => {
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
        <strong>Order ID:</strong> {Global.orderId}
      </div>
      <div className="mb-4">
        <strong>Order Total:</strong> ${Global.orderTotal}
      </div>
      <div className="mb-4">
        <strong>Shipping Address:</strong> {Global.shippingAddress.first_name}{Global.shippingAddress.last_name},
        {Global.shippingAddress.email}
        {Global.shippingAddress.phone}
        {Global.shippingAddress.company}
        {Global.shippingAddress.street_1}
        {Global.shippingAddress.street_2}
        {Global.shippingAddress.city}
        {Global.shippingAddress.state}
        {Global.shippingAddress.country_iso2}
        {Global.shippingAddress.zip}
      </div>
    </div>
  );
};

export default OrderConfirmation;
