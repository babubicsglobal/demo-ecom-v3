"use client"; // This is a client component
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ImageData({ product_id }) {
  const [image, setImage] = useState([]);
  const productId = product_id ?? 0;

  useEffect(() => {
    getOrder(productId);
  }, []);

  const getOrder = async (productId) => {
    const req_img = {
      id: productId.toString(),
    };

    console.log("Requestimage", req_img);
    const image = await axios.post("api/orderimage", req_img);
    setImage(image.data.data.images[0].url_standard);
    console.log("image", image);
  };

  return (
    <div className="container mx-auto p-4">
      <img src={image} className="w-28 h-30 object-contain mr-4" />
    </div>
  );
}
