import React from "react";
import { Link } from "react-router-dom";
import hero_image from "../../assets/images/img3.jpg";
import explore_image from "../../assets/images/pilates1.jpg";
import trainer_image from "../../assets/images/HIIT2.jpg";
import { InfiniteCarousel } from "../../components/shared/InfiniteCarousel";


const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <div className="relative h-screen w-full">
        <img
          src={hero_image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover z-10"
        />
        <div className="absolute inset-0 bg-transparent bg-opacity-50 flex flex-col justify-center items-center text-white text-center z-20">
          <h1 className="text-5xl font-semibold space-10 tracking-widest">
            READY TO TRANSFORM?
          </h1>
          <Link
            to="/signup"
            className=" mt-20 rounded-4xl py-2 px-6 bg-[#2916BA] hover:bg-blue-800"
          >
            JOIN NOW
          </Link>
        </div>
      </div>

      {/* Explore Communities & Become a Trainer */}
      <div className="grid grid-cols-2 gap-4 p-10 z-10 ">
        <div className="relative">
          <h1 className="absolute top-4  px-4 py-2 text-white font-bold text-4xl">
            Explore Communities
          </h1>
          <img
            src={explore_image}
            alt="Explore Communities"
            className="w-full h-full object-cover"
          />
          <Link
            to="/communities"
            className="absolute bottom-4 left-4 px-6 py-2 bg-[#2916BA] hover:bg-blue-900 text-white rounded-4xl"
          >
            Explore
          </Link>
        </div>
        <div className="relative">
          <h1 className="absolute top-4  px-4 py-2 text-white font-bold text-4xl">
            Become a Trainer
          </h1>
          <img
            src={trainer_image}
            alt="Become a Trainer"
            className="w-full h-full object-cover"
          />
          <Link
            to="/trainer/apply"
            className="absolute bottom-4 left-4 px-6 py-2 bg-[#2916BA] hover:bg-blue-900 text-white rounded-4xl"
          >
            Apply Now
          </Link>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="text-center p-12 mt-14">
        <h2 className="text-4xl font-bold">WELCOME TO FIT&CORE</h2>
        <p className="text-gray-600 mt-8 w-1/2 mx-auto text-lg">
          Whether you're a beginner or a fitness pro, we’re here to help you
          crush your goals and feel your best. Discover the next level fitness
          experience that refuses to cut corners when it comes to quality, Let’s
          sweat, smile, and succeed together!
        </p>
        <Link
          to="/signup"
          className="mt-20 inline-block px-6 py-3  bg-[#2916BA] text-white rounded-4xl"
        >
          Try It Now
        </Link>
      </div>

      {/* Our Concepts */}
      <div className="text-center p-12">
        <h2 className="text-4xl font-bold">OUR CONCEPTS</h2>
        <p className="text-gray-600 mt-10 w-1/2 mx-auto text-lg">
          Our app offers five dynamic workout categories to keep your routine
          fresh, fun, and effective. Dive into Yoga for mindfulness and
          flexibility, groove with Zumba for high-energy dance workouts, build
          strength with Calisthenics, torch calories with HIIT, and sculpt your
          body with Pilates. Whether you're looking to relax, dance, strengthen,
          or sweat, we’ve got something for everyone. With expert-led sessions,
          customizable plans, and progress tracking, achieving your fitness
          goals has never been easier or more enjoyable!
        </p>
      </div>

      {/* Horizontal Scrolling - Different Programs */}
      <div className="p-12 overflow-hidden">
          <InfiniteCarousel/>
      </div>

      {/* Buy Workouts */}
      <div className="relative p-12">
        <img
          src="/assets/images/buy-workouts.jpg"
          alt="Buy Workouts"
          className="w-full h-80 object-cover rounded-md"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white">
          <h2 className="text-3xl font-semibold">BUY WORKOUTS</h2>
          <p className="mt-4">
            Get exclusive workouts from professional trainers.
          </p>
          <Link
            to="/workouts"
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-4xl"
          >
            Let's Go
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
