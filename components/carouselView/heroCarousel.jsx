"use client"; // This is a client component
import React from "react";
import { useState, useEffect, useMemo, createRef, useRef } from "react";
import { CAROUSEL_COMPONENT_TYPE } from "../../app/utils/constants";
import Carousel from "./carouselView";
const CREATE_MEDIA_OBJ = {
  imageWithLink: (mediaItem) => ({
    type: CAROUSEL_COMPONENT_TYPE.IMAGE_WITH_LINK,
    src: mediaItem?.fields?.heroBannerImage?.fields?.file?.url ?? "",
    // redirectTo: mediaItem?.image_link?.alias ?? "",
    // titleText: mediaItem?.media?.field_image?.meta?.title ?? "",
  }),
};

const transformData = (mediaItems) => {
  return mediaItems
    .map((mediaItem) => {
      //   const mediaType = mediaItem?.type;
      let mediaObj;
      //   switch (mediaType) {
      //     case CAROUSEL_COMPONENT_TYPE.IMAGE_WITH_LINK:

      //       break;

      //     default:
      //       mediaObj = null;
      //       break;
      //   }
      mediaObj = CREATE_MEDIA_OBJ.imageWithLink(mediaItem);
      return mediaObj;
    })
    .filter((item) => item !== null);
};

const generateCarouselItems = (items, customConfig) => {
  const linkRegex = new RegExp("^(/prof)");
  const { redirectCarouselItem, setSliderAutoplay } = customConfig;

  if (!items) {
    return null;
  }

  return items
    .map((item, itemIndex) => {
      const itemLinkRef = createRef();
      if (item.type === CAROUSEL_COMPONENT_TYPE.IMAGE_WITH_LINK) {
        return (
          <div key={`hero-carousel-image-with-link-${itemIndex}`}>
            <div>
              <div
                role="img"
                aria-label={item.alterText}
                title={item.titleText}
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 50%, rgba(33,33,33,0.48) 77%, rgba(33,33,33,0.96) 100%), url('${item.src}')`,
                }}
                className="hero_carousel_image"
              ></div>
            </div>
          </div>
        );
      } else {
        return null;
      }
    })
    .filter((item) => item !== null);
};

const HeroCarousel = ({ contentData }) => {
  const mediaItems = useMemo(() => contentData, [contentData]);
  const [mediaData, setMediaData] = useState([]);
  const carouselRef = useRef();
  const settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 600,
    autoplaySpeed: 5000,
    cssEase: "linear",
    pauseOnHover: true,
    dots: true,
    adaptiveHeight: true,
   
    // prevArrow: <PrevArrow />,
    // nextArrow: <NextArrow />,
    //afterChange: stopMedia,
  };




  const redirectCarouselItem = (redirectLinkRef) => (event) => {
    event.stopPropagation();
    redirectLinkRef?.current?.click?.();
  };

  const setSliderAutoplay = (value) => {
    if (value) {
      carouselRef.current?.slickPlay();
    } else {
      carouselRef.current?.slickPause();
    }
  };

  useEffect(() => {
    if (mediaItems) {
      const transformedData = transformData(mediaItems);
      setMediaData(transformedData);
    }

    return () => {
      setMediaData([]);
    };
  }, [mediaItems]);

  return (
    <>
      {mediaData ? (
        <div className="carousel_wrapper" id="carouselContainer">
          <Carousel ref={carouselRef} {...settings}>
            {generateCarouselItems(mediaData, {
              redirectCarouselItem,
              setSliderAutoplay,
            })}
          </Carousel>
        </div>
      ) : null}
    </>
  );
};

export default HeroCarousel;
