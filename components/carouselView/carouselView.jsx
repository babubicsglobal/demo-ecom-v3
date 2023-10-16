import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousel = React.forwardRef((settings, ref) => {
  return <Slider ref={ref} {...settings} />;
});
Carousel.displayName = "Carousel";
export default Carousel;
