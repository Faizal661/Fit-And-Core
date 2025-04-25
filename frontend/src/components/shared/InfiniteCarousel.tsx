import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from "react";
import "../../assets/styles/tailwind.css";
import { motion } from "framer-motion";

import yoga from "../../assets/images/yoga3.jpg";
import calisthenics from "../../assets/images/calisthenics1.jpg";
import hiit from "../../assets/images/HIIT3.jpg";
import pilates from "../../assets/images/pilates4.jpg";
import zumba from "../../assets/images/Zumba1.jpg";

export const InfiniteCarousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    centerMode: true,
    centerPadding: "0px",
    dots: true,
    arrows: false,
    beforeChange: (current: number, next: number) => setActiveSlide(next),
    customPaging: (i: number) => (
      <div
        style={{
          width: "30px",
          height: "2px",
          background: i === activeSlide ? "#333" : "#ddd",
          margin: "20px 2px",
          transition: "all 0.3s ease",
          cursor: "pointer",
        }}
      />
    ),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const programItems = [
    { image: yoga, name: "Yoga" },
    { image: calisthenics, name: "Calisthenics" },
    { image: hiit, name: "HIIT" },
    { image: pilates, name: "Pilates" },
    { image: zumba, name: "Zumba" },
  ];

  return (
    <div>
      <div className="relative max-w-6xl mx-auto py-6">
        <Slider {...settings}>
          {programItems.map((item, index) => (
            <div key={index} className="slide-item px-3">
              <motion.div
                className={`relative transition-all duration-300`}
                style={{
                  opacity: index === activeSlide ? 1 : 0.6,
                  scale: index === activeSlide ? 1.05 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-80 object-cover shadow-md"
                />
                 <div className="absolute inset-0 flex items-end p-6">
                  <p className="text-white font-light text-xl tracking-wide">
                    {item.name}
                  </p>
                </div>
              </motion.div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};
