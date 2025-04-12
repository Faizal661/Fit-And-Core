import { Link } from "react-router-dom";
import hero_image from "../../assets/images/img3.jpg";
import explore_image from "../../assets/images/pilates1.jpg";
import trainer_image from "../../assets/images/HIIT2.jpg";
import { InfiniteCarousel } from "../../components/shared/InfiniteCarousel";
import Footer from "../../components/shared/Footer";

const LandingPage = () => {
  return (
    <div className="landing-page bg-white text-gray-800">
      {/* Hero Section */}
      <div className="relative h-screen w-full">
        <img
          src={trainer_image}
          alt="Fitness hero"
          className="absolute inset-0 w-full h-full object-cover z-10 brightness-75"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center z-20 px-4">
          <h1 className="text-4xl md:text-5xl font-light  mb-12">
            READY TO TRANSFORM
          </h1>
          <Link
            to="/signup"
            className="mt-6 py-3 px-8 bg-white text-gray-800 hover:bg-gray-100 transition-colors"
          >
            JOIN NOW
          </Link>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="max-w-3xl mx-auto text-center py-20 px-6">
        <h2 className="text-3xl font-light mb-10">WELCOME TO FIT&CORE</h2>
        <p className="text-gray-600 mb-12 leading-relaxed">
          Whether you're a beginner or a fitness pro, we're here to help you
          crush your goals and feel your best. Discover a fitness experience
          that refuses to cut corners when it comes to quality.
        </p>
        <Link
          to="/signup"
          className="inline-block px-8 py-3 border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition-colors"
        >
          Try It Now
        </Link>
      </div>

      {/* Explore Options Grid */}
      <div className="sm:flex gap-1">
        <div className="relative h-96 py-1 sm:p-0 overflow-hidden flex-5 transition-all duration-300  hover:flex-6">
          <img
            src={explore_image}
            alt="Explore Communities"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-between p-10  pointer-events-none">
            <h3 className="text-white text-2xl font-light">
              Explore Communities
            </h3>
            <Link
              to="/communities"
              className="self-start px-6 py-2 bg-white text-gray-800 hover:bg-gray-100 transition-colors  pointer-events-auto"
            >
              Explore
            </Link>
          </div>
        </div>
        <div className="relative h-96  py-1 sm:p-0  overflow-hidden flex-5 transition-all duration-300  hover:flex-6 ">
          <img
            src={hero_image}
            alt="Become a Trainer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-between p-10 pointer-events-none">
            <h3 className="text-white text-2xl font-light">Become a Trainer</h3>
            <Link
              to="/trainer/apply"
              className="self-start px-6 py-2 bg-white text-gray-800 hover:bg-gray-100 transition-colors  pointer-events-auto"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>

      {/* Our Concepts */}
      <div className="max-w-3xl mx-auto text-center py-20 px-6">
        <h2 className="text-3xl font-light mb-10">OUR CONCEPTS</h2>
        <p className="text-gray-600 leading-relaxed">
          Our app offers five dynamic workout categories: Yoga for mindfulness
          and flexibility, Zumba for high-energy dance workouts, Calisthenics
          for strength, HIIT for calorie burning, and Pilates for body
          sculpting. With expert-led sessions and customizable plans, achieving
          your fitness goals has never been more enjoyable.
        </p>
      </div>

      {/* Programs Carousel */}
      <div className="py-16 bg-gray-50">
        <InfiniteCarousel />
      </div>

      {/* Buy Workouts */}
      <div className="relative h-80 my-16">
        <img
          src="/assets/images/buy-workouts.jpg"
          alt="Buy Workouts"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white">
          <h2 className="text-3xl font-light mb-6">BUY WORKOUTS</h2>
          <p className="mb-8">
            Get exclusive workouts from professional trainers
          </p>
          <Link
            to="/workouts"
            className="px-8 py-3 bg-white text-gray-800 hover:bg-gray-100 transition-colors"
          >
            Let's Go
          </Link>
        </div>
      </div>
      <Footer/>
    </div>

  );
};

export default LandingPage;
