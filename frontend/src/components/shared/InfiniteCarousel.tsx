import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from "react";
import "../../assets/styles/tailwind.css";


import yoga from "../../assets/images/yoga3.jpg";
import calisthenics from "../../assets/images/calisthenics1.jpg";
import hiit from "../../assets/images/HIIT3.jpg";
import pilates from "../../assets/images/pilates4.jpg";
import zumba from "../../assets/images/Zumba1.jpg";

export const InfiniteCarousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const settings = {
    infinite: true,
    speed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 600,
    centerMode: true,
    centerPadding: "0px",
    dots: true,
    beforeChange: (current:number, next:number) => setActiveSlide(next),
    customPaging: (i:number) => (
      <div
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          background: i === activeSlide ? "#fff" : "rgba(255, 255, 255, 0.5)",
          border: "1px solid #fff",
          margin: "0 4px",
          transition: "all 0.3s ease",
        }}
      />
    ),
  };

  const programItems = [
    { image: yoga, name: "Yoga" },
    { image: calisthenics, name: "Calisthenics" },
    { image: hiit, name: "HIIT" },
    { image: pilates, name: "Pilates" },
    { image: zumba, name: "Zumba" },
  ];

    return (
    <div className="p-12">
      <div className="relative">
        <Slider {...settings}>
          {programItems.map((item, index) => (
            <div key={index} className="slide-item">
              <div className={`relative px-2 transition-all duration-1000 overflow-visible ${index === activeSlide ? "scale-105" : "scale-90 opacity-80"}`}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-100 object-cover rounded-lg"
                />
                <p className="absolute bottom-4 left-4 text-white font-semibold uppercase">
                  {item.name}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
