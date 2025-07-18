import { ChevronDown, ArrowRight, Users, Award, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import hero_image from "../../assets/images/img3.jpg";
import explore_image from "../../assets/images/pilates1.jpg";
import trainer_image from "../../assets/images/yoga4.jpg";
import { InfiniteCarousel } from "../../components/shared/InfiniteCarousel";
import Footer from "../../components/shared/footer";

import { motion, AnimatePresence } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import ScrollTrigger from "@ppasmik/react-scroll-trigger";
import { GlowLink } from "../../components/buttons/GlowLink";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const fadeIn = {
  hidden: { opacity: 0, y: 300 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const LandingPage = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [welcomeRef, welcomeInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [statsRef, statsInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [exploreRef, exploreInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [countStarted, setCountStarted] = useState(false);

  useEffect(() => {
    if (videoModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [videoModalOpen]);

  return (
    <div className="landing-page bg-gray-50 text-gray-800 overflow-hidden">
      {/* Hero Section with dynamic video background */}
      <motion.div
        ref={heroRef}
        className="relative h-screen w-full overflow-hidden"
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30 z-20"></div>
        <motion.div
          animate={{ scale: 1.05 }}
          transition={{
            repeat: Infinity,
            duration: 20,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="absolute inset-0"
        >
          <img
            src={trainer_image}
            alt="Fitness hero"
            className="absolute inset-0 w-full h-full object-cover z-10 brightness-90"
          />
        </motion.div>

        {/* Overlay pattern */}
        <div
          className="absolute inset-0 bg-black/20 z-20 opacity-30"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center z-30 px-6">
          <motion.div
            variants={fadeIn}
            className="mb-4 text-blue-400 font-medium"
          >
            FITNESS REDEFINED
          </motion.div>
          <motion.h1
            variants={fadeIn}
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight"
          >
            READY TO
            <TypeAnimation
              sequence={[
                " TRANSFORM",
                3000,
                " CHALLENGE",
                3000,
                " INSPIRE",
                3000,
              ]}
              wrapper="span"
              speed={40}
              repeat={Infinity}
              className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent"
            />
          </motion.h1>

          <motion.p
            variants={fadeIn}
            className="text-md sm:text-lg md:text-xl max-w-2xl mb-12 text-gray-200"
          >
            Join the community that's changing how people approach fitness.
            Expert training, supportive community, real results.
          </motion.p>

          <motion.div
            variants={fadeIn}
            className="flex flex-col sm:flex-row gap-6"
          >
            {!user && (
              <GlowLink to="/signup" primary>
                JOIN NOW
              </GlowLink>
            )}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30"
          animate={{ y: [0, -30, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
          }}
        >
          <ChevronDown size={32} className="text-white/80" />
        </motion.div>

        {/* Hero curved shape divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden z-30">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-16 text-gray-50"
          >
            <path
              d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z"
              className="fill-current"
            ></path>
          </svg>
        </div>
      </motion.div>

      {/* Video Modal */}
      <AnimatePresence>
        {videoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-black rounded-xl overflow-hidden w-full max-w-4xl shadow-2xl"
            >
              <div className="aspect-video bg-gray-900">
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <video
                      src="https://res.cloudinary.com/dno9qcs9o/video/upload/v1745405547/2376809-hd_1920_1080_24fps_2_iwb2zj.mp4"
                      autoPlay
                      controls
                      loop
                    ></video>
                    {/* <p className="text-2xl mb-4">Video Player Placeholder</p>
                    <p className="text-gray-400">
                      Your promotional video would play here
                    </p> */}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/80 transition-colors hover:cursor-pointer"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome Section */}
      <motion.div
        ref={welcomeRef}
        className="max-w-5xl mx-auto text-center py-24 px-6"
        initial="hidden"
        animate={welcomeInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <motion.div
          variants={fadeIn}
          className="inline-block mb-6 px-4 py-1 rounded-full bg-blue-100 text-blue-600 font-medium text-sm"
        >
          ABOUT US
        </motion.div>
        <motion.h2
          variants={fadeIn}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          WELCOME TO{" "}
          <span className="bg-gradient-to-r from-cyan-600 to-purple-400 bg-clip-text text-transparent">
            FIT&CORE
          </span>
        </motion.h2>
        <motion.div
          variants={scaleIn}
          className="w-20 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 mx-auto mb-8 rounded-full"
        ></motion.div>
        <motion.p
          variants={fadeIn}
          className="text-gray-600 mb-12 leading-relaxed text-lg max-w-3xl mx-auto"
        >
          Whether you're a beginner or a fitness pro, we're here to help you
          crush your goals and feel your best. Discover a fitness experience
          that refuses to cut corners when it comes to quality, community, and
          results.
        </motion.p>

        <motion.div
          variants={fadeIn}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          <div className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mx-auto mb-4">
              <Users size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2">Community</h3>
            <p className="text-gray-600">
              Join a supportive network of fitness enthusiasts who share your
              goals
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto mb-4">
              <Award size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2">Expert Trainers</h3>
            <p className="text-gray-600">
              Learn from certified professionals who specialize in various
              fitness disciplines
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-amber-100 text-amber-600 mx-auto mb-4">
              <Clock size={28} />
            </div>
            <h3 className="text-xl font-bold mb-2">Flexible Schedule</h3>
            <p className="text-gray-600">
              Access workouts annytime, annywhere to fit your busy lifestyle
            </p>
          </div>
        </motion.div>

        <motion.div variants={fadeIn}>
          {!user && (
            <GlowLink to="/signup" primary>
              Try It Now
            </GlowLink>
          )}
        </motion.div>
      </motion.div>

      {/* Stats Counter Section */}
      <ScrollTrigger onEnter={() => setCountStarted(true)}>
        <motion.div
          ref={statsRef}
          className="py-16 bg-gradient-to-r from-cyan-600 to-purple-400 text-white"
          initial="hidden"
          animate={statsInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <motion.div variants={fadeIn} className="p-4">
                <div className="text-5xl font-bold mb-2">
                  {countStarted && (
                    <CountUp end={13} duration={4.5} suffix="+" />
                  )}
                  {!countStarted && "1+"}
                </div>
                <p className="text-blue-100">Expert Trainers</p>
              </motion.div>

              <motion.div variants={fadeIn} className="p-4">
                <div className="text-5xl font-bold mb-2">
                  {countStarted && (
                    <CountUp end={63} duration={4.5} suffix="+" />
                  )}
                  {!countStarted && "10+"}
                </div>
                <p className="text-blue-100">Active Members</p>
              </motion.div>

              <motion.div variants={fadeIn} className="p-4">
                <div className="text-5xl font-bold mb-2">
                  {countStarted && (
                    <CountUp end={487} duration={4.5} suffix="+" />
                  )}
                  {!countStarted && "101+"}
                </div>
                <p className="text-blue-100">Weekly Classes</p>
              </motion.div>

              <motion.div variants={fadeIn} className="p-4">
                <div className="text-5xl font-bold mb-2">
                  {countStarted && (
                    <CountUp end={98} duration={4.5} suffix="%" />
                  )}
                  {!countStarted && "10%"}
                </div>
                <p className="text-blue-100">Satisfaction Rate</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </ScrollTrigger>

      {/* Explore Options Grid with 3D hover effects */}
      <motion.div
        ref={exploreRef}
        className="sm:flex gap-0"
        initial="hidden"
        animate={exploreInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <motion.div
          variants={slideInLeft}
          className="relative h-96 sm:h-auto py-0 sm:p-0 overflow-hidden flex-1 group"
        >
          <img
            src={explore_image}
            alt="Explore Communities"
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute inset-0 flex flex-col justify-end p-10 pointer-events-none">
            <h3 className="text-white text-3xl font-bold tracking-tight mb-4">
              Explore Communities
            </h3>
            <p className="text-gray-300 mb-6 max-w-md">
              Connect with like-minded fitness enthusiasts and find your tribe
            </p>
            {user ? (
              <Link
                to="/communities"
                className="pointer-events-auto self-start flex items-center gap-2 px-6 py-3 bg-white text-gray-800 rounded-md shadow-lg hover:bg-gray-100 transition-all duration-300 group/btn"
              >
                <span>Explore</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover/btn:translate-x-1"
                />
              </Link>
            ) : (
              <Link
                to="/signup"
                className="pointer-events-auto self-start flex items-center gap-2 px-6 py-3 bg-white text-gray-800 rounded-md shadow-lg hover:bg-gray-100 transition-all duration-300 group/btn"
              >
                <span>Sign Up</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover/btn:translate-x-1"
                />
              </Link>
            )}
          </div>
        </motion.div>

        <motion.div
          variants={slideInRight}
          className="relative h-96 sm:h-auto py-0 sm:p-0 overflow-hidden flex-1 group"
        >
          <img
            src={hero_image}
            alt="Become a Trainer"
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute inset-0 flex flex-col justify-end p-10 pointer-events-none">
            <h3 className="text-white text-3xl font-bold tracking-tight mb-4">
              Become a Trainer
            </h3>
            <p className="text-gray-300 mb-6 max-w-md">
              Share your expertise and build your brand with our global platform
            </p>
            {user ? (
              <Link
                to="/trainer/apply"
                className="pointer-events-auto self-start flex items-center gap-2 px-6 py-3 bg-white text-gray-800 rounded-md shadow-lg hover:bg-gray-100 transition-all duration-300 group/btn"
              >
                <span>Apply Now</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover/btn:translate-x-1"
                />
              </Link>
            ) : (
              <Link
                to="/signup"
                className="pointer-events-auto self-start flex items-center gap-2 px-6 py-3 bg-white text-gray-800 rounded-md shadow-lg hover:bg-gray-100 transition-all duration-300 group/btn"
              >
                <span>Sign Up</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover/btn:translate-x-1"
                />
              </Link>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Programs Carousel with glass effect */}
      <div className="py-24 bg-gradient-to-br from-blue-50 to-emerald-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="url(#grid)"
              className="text-blue-900"
            />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          <div className="text-center mb-16">
            <div className="inline-block mb-6 px-4 py-1 rounded-full bg-blue-100 text-blue-600 font-medium text-sm">
              TOP PROGRAMS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              FEATURED{" "}
              <span className="bg-gradient-to-r from-cyan-600 to-purple-400 bg-clip-text text-transparent">
                PROGRAMS
              </span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 mx-auto mb-8 rounded-full"></div>
          </div>

          <div className="backdrop-blur-sm bg-white/80 max-w-6xl mx-auto rounded-2xl shadow-xl border border-white/50 p-4">
            <InfiniteCarousel />
          </div>
        </motion.div>
      </div>

      {/* Call to Action with Wavy Background */}
      <div className="py-24 relative overflow-hidden bg-gradient-to-r from-cyan-600 to-purple-400">
        {/* Wavy background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg
            viewBox="0 0 1440 320"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-0 text-white"
          >
            <path
              fill="currentColor"
              fillOpacity="1"
              d="M0,192L48,192C96,192,192,192,288,170.7C384,149,480,107,576,112C672,117,768,171,864,186.7C960,203,1056,181,1152,154.7C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
          <svg
            viewBox="0 0 1440 320"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute bottom-0 text-white rotate-180"
          >
            <path
              fill="currentColor"
              fillOpacity="0.5"
              d="M0,192L48,192C96,192,192,192,288,170.7C384,149,480,107,576,112C672,117,768,171,864,186.7C960,203,1056,181,1152,154.7C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center px-6 relative z-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            START YOUR FITNESS JOURNEY TODAY
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of members who have transformed their lives with
            FIT&CORE's premium fitness experience.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block"
          >
            {user ? (
              <GlowLink to="/find-trainers" primary className="text-xl px-12 py-5">
                GET STARTED NOW
              </GlowLink>
            ) : (
              <GlowLink to="/signup" primary className="text-xl px-12 py-5">
                GET STARTED NOW
              </GlowLink>
            )}
          </motion.div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            <div className="backdrop-blur-sm bg-white/10 p-6 rounded-xl border border-white/20">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white/20 mx-auto mb-4">
                <Clock size={30} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">24/7 Access</h3>
              <p className="text-white/80">
                Workout an_ytime, an_ywhere with on-demand classes and
                personalized plans
              </p>
            </div>

            <div className="backdrop-blur-sm bg-white/10 p-6 rounded-xl border border-white/20">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white/20 mx-auto mb-4">
                <Users size={30} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Global Community</h3>
              <p className="text-white/80">
                Connect with like-minded fitness enthusiasts from around the
                world
              </p>
            </div>

            <div className="backdrop-blur-sm bg-white/10 p-6 rounded-xl border border-white/20">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white/20 mx-auto mb-4">
                <Award size={30} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Certified Experts</h3>
              <p className="text-white/80">
                Learn from qualified professionals with years of experience in
                their fields
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* FAQ Section with Accordion */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block mb-6 px-4 py-1 rounded-full bg-blue-100 text-blue-600 font-medium text-sm">
              FAQ
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              FREQUENTLY{" "}
              <span className="bg-gradient-to-r from-cyan-600 to-purple-400 bg-clip-text text-transparent">
                ASKED QUESTIONS
              </span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 mx-auto mb-8 rounded-full"></div>
          </div>

          {[
            {
              question: "What types of workouts do you offer?",
              answer:
                "We offer a wide variety of workout styles including Yoga, Pilates, HIIT, Zumba, and Calisthenics. Our programs cater to all fitness levels from beginners to advanced athletes.",
            },
            {
              question: "Do I need special equipment?",
              answer:
                "Most of our programs require minimal or no equipment. For those that do, we offer alternatives or modifications to make them accessible for everyone.",
            },
            {
              question: "How do I track my progress?",
              answer:
                "Our app includes comprehensive progress tracking features including workout history, achievement badges, and body metrics to help you visualize your journey.",
            },
            // {
            //   question: "Is there a free trial available?",
            //   answer:
            //     "Absolutely! We offer a 7-day free trial so you can experience the full benefits of our platform before committing to a subscription.",
            // },
          ].map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <details className="group bg-white rounded-xl shadow-lg border border-gray-100 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-6 text-gray-900">
                  <h3 className="font-medium text-lg">{faq.question}</h3>
                  <svg
                    className="h-5 w-5 transition duration-300 group-open:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-6 pt-1 text-gray-600">{faq.answer}</div>
              </details>
            </motion.div>
          ))}

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-8">
              Still have questions? We're here to help!
            </p>
            <Link
              to="#contact-support"
              className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
            >
              Contact Support
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
