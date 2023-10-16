"use client"; // This is a client component
import React, { useEffect, useState } from "react";
import ProductsCategoryPage from "../products/page";
import HeroCarousel from "../../components/carouselView/heroCarousel";
import BannerPage from "../../components/heroBanner/bannerPage";
import MultiValueContextDemo from "../context/commerceProduct";
import ImageSlider from "../../components/imageSlider/imageSlider";
import { client } from "../../lib/contentful/client";

function HomePage() {
  const [heroCarouselList, setHeroCarouselList] = useState([]);

  const getCarousel = async () => {
    const response = await client.getEntries({ content_type: "heroBanner" });
    const responseData = response.items;
    setHeroCarouselList(responseData);
    console.log("heroBanner", responseData);
  };

  useEffect(() => {
    getCarousel();
  }, []);

  if (heroCarouselList)
    return (
      <div>
        {/* <ImageSlider /> */}
        <HeroCarousel contentData={heroCarouselList}></HeroCarousel>
        <ProductsCategoryPage></ProductsCategoryPage>
      </div>
    );
}

export default HomePage;
