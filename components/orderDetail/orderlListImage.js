"use client"; // This is a client component
import React, { useMemo } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import ImageData from "../../components/orderDetail/imageViewList";

const orderListImage = ({ order_id }) => {
  const [order, setOrder] = useState([]);

  console.log("order", order);
  const getOrder = async () => {
    const request = {
      id: order_id,
    };
    console.log("request", request);
    const result = await axios.post("api/orderdetail", request);
    console.log("result", result);
    const order_detail = result.data;
    setOrder(order_detail);
  };

  useEffect(() => {
    getOrder();
  }, []);

  if (order.length > 0)
    return (
      <div className="container mx-auto p-4">
        {order.map((item) => (
          <>
            <h1>
              <b>Product Name:</b> {item.name}
            </h1>
            <ImageData product_id={item.product_id} />
          </>
        ))}
      </div>
    );
};

export default orderListImage;
