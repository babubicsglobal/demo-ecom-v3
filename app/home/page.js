"use client"; // This is a client component
import React from "react";
import ProductsCategoryPage from "../products/page";
import BannerPage from "../../components/heroBanner/bannerPage";
import MultiValueContextDemo from "../context/commerceProduct";
import ImageSlider from "../../components/imageSlider/imageSlider";

function HomePage() {
  return (
    <div className="container mx-auto">
      <MultiValueContextDemo>
        <ImageSlider />
      </MultiValueContextDemo>

      <ProductsCategoryPage></ProductsCategoryPage>
    </div>
  );
}

export default HomePage;
