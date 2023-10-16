"use client"; // This is a client component
import React, { useMemo } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const imageViewList = ({ product_id }) => {
  const [image, setImage] = useState([]);

  console.log("product_id", product_id);
  useEffect(() => {
    getOrder();
  }, []);

  const getOrder = async () => {
    const req_img = {
      id: product_id.toString(),
    };

    console.log("Requestimage", req_img);
    const image = await axios.post("api/orderimage", req_img);
    setImage(image.data.data.images[0].url_standard);
  };

  return (
    <div className="container mx-auto p-4">
      <img src={image} className="w-28 h-30 object-contain mr-4" />
    </div>
  );
};

export default imageViewList;
