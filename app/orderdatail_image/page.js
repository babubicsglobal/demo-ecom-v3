"use client"; // This is a client component
import React, { useEffect, useState } from "react";
import axios from "axios";

function Image({product_id}) {
  const [order, setOrder] = useState([]);
  const [image, setImage] = useState([]);

  console.log("order", order);
  const getOrder = async () => {
    const request = {
      id: sessionStorage.getItem("orderid"),
    };
    console.log("request", request);
    // const result = await axios.post("api/orderdetail", request);
    // console.log("result", result);
    // const order_detail = result.data[0]
    const req_img = {
      id:product_id,
    };
    const image = await axios.post("api/orderimage",req_img );
    setImage(image.data.data.images[0].url_standard)
      console.log('image',image)
    // setOrder(order_detail);
    // sessionStorage.setItem("orderid",result.data)
  };
  useEffect(() => {
    getOrder();
  }, []);

  return (
    <div className="container mx-auto p-4">
        {/* <h1><b>Product Name:  </b> {order.name}</h1> */}
        {/* <h1>{order.price_ex_tax}</h1>
        <h1>{order.base_total}</h1> */}
       <img
       src = {image}
       className="w-28 h-30 object-contain mr-4"
       />
    </div>
  );
}

export default Image;
