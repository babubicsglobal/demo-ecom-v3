"use client"; // This is a client component
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "../orderdetail_image/page";

function OrderDetail() {
  const [order, setOrder] = useState([]);
  const [billing_address, setBilling_address] = useState([]);
  const [shipping_address, setShipping_address] = useState([]);

  console.log("order", order);
  console.log("billing_address", billing_address);
  console.log("shipping_address", shipping_address);

  const getOrder = async () => {
    const request = {
      id: sessionStorage.getItem("orderid"),
    };
    const result = await axios.post("api/orderdetail", request);
    const order_detail = result.data;
    console.log("order_detail", order_detail);
    setOrder(order_detail);
    const billing_req = {
      id: sessionStorage.getItem("orderid"),
    };
    const result_billing = await axios.post("api/order", billing_req);
    const newproducts =
      result_billing.data.filter(
        (item) => item.id === Number(billing_req.id)
      )[0] || {};
    console.log("newproducts", newproducts);

    setBilling_address(newproducts);

    const shipping_req = {
      id: sessionStorage.getItem("orderid"),
    };
    const shipping_result = await axios.post("api/ordershipping", shipping_req);
    console.log("shipping_result", shipping_result);
    setShipping_address(shipping_result.data[0] || {});
    console.log("shipping_address", shipping_address);
  };
  useEffect(() => {
    getOrder();
  }, []);

  if (order)
    return (
      <div className="flex flex-wrap -mx-1 lg:-mx-4">
        <div className="container mx-auto">
          <div className="grid grid-flow-row-dense grid-cols-1 grid-rows-1">
            {order.map((item) => (
              <>
                <tr key={item.id} className="border-b">
                  <Image product_id={item.product_id} />
                  <h1>
                    <b>Product Name: </b> {item.name}
                  </h1>
                  <h1>
                    <b>Total: </b> {parseFloat(item.base_total).toFixed(2)}
                  </h1>
                  <h1>
                    <b>Type: </b> {item.type}
                  </h1>
                </tr>
              </>
            ))}
          </div>
          <h1>
            <b>Address: </b>
            {billing_address?.billing_address?.street_1},
            {billing_address?.billing_address?.city},
            {billing_address?.billing_address?.state},
            {billing_address?.billing_address?.country}, zip:
            {billing_address?.billing_address?.zip}.
          </h1>
          <br></br>
          <b>Shipping Address:</b>
          {shipping_address.state}.
        </div>
      </div>
    );
}

export default OrderDetail;
