"use client"; // This is a client component
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Image({ product_id }) {
  const [image, setImage] = useState([]);
  const getOrder = async () => {
    const req_img = {
      id: product_id,
    };
    const image = await axios.post("api/orderimage", req_img);
    setImage(image.data.data.images[0].url_standard);
    console.log("image", image);
  };
  useEffect(() => {
    getOrder();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <img src={image} className="w-28 h-30 object-contain mr-4" />
    </div>
  );
}