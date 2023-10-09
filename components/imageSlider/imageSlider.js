// components/ImageSlider.js
import React, { useState, useEffect } from "react";

const images = [
  "/image1.png",
  "/image2.png",
  "/image3.png",
  "/image4.png",
  "/image5.png",
];

const ImageSlider = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prevImage) =>
      prevImage === 0 ? images.length - 1 : prevImage - 1
    );
  };

  return (
    <div className="relative h-64">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Image ${index}`}
          className={`absolute w-full h-full transition-opacity duration-500 ${
            index === currentImage ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <button
        onClick={prevImage}
        className="absolute top-1/2 left-4 transform -translate-y-1/2"
      >
        <img src="/left-arrow.png" alt="left-arrow" width="20" height="20" />
      </button>
      <button
        onClick={nextImage}
        className="absolute top-1/2 right-4 transform -translate-y-1/2"
      >
        <img src="/right-arrow.png" alt="right-arrow" width="20" height="20" />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        {images.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`h-2 w-2 mx-2 inline-block rounded-full cursor-pointer ${
              index === currentImage ? "bg-red-500" : "bg-gray-400"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
