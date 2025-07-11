import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { AlertCircle, RotateCw, ArrowLeft } from "lucide-react";
import { GlowButton } from "../../../components/buttons/GlowButton";
import Footer from "../footer";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const ErrorPage = ({
  title = "Error Occurred",
  message = "An unexpected error has occurred. Please try again.",
}) => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative py-24 bg-gradient-to-r from-blue-600/90 to-purple-600/90 overflow-hidden h-96 ">
        <div
          className="absolute inset-0 bg-black/10 z-0 opacity-30"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>

        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-6 text-white"
          >
            <path
              d="M0,126L80,109.7C160,93,320,61,480,42C640,23,800,19,960,32.7C1120,47,1280,79,1440,95.7C1600,112,1760,112,1920,102.7C2080,93,2240,75,2400,67.7C2560,61,2720,65,2880,63C3040,61,3200,51,3360,39.7C3520,28,3680,14,3840,7C4000,0,4160,0,4320,7C4480,14,4640,28,4800,42C4960,56,5120,70,5280,65.3C5440,61,5600,37,5760,44.3C5920,51,6080,89,6240,91C6400,93,6560,61,6720,44.3C6880,28,7040,28,7200,37.3C7360,47,7520,65,7680,79.3C7840,93,8000,103,8160,105C8320,107,8480,103,8640,88.7C8800,75,8960,51,9120,49C9280,47,9440,65,9600,79.3C9760,93,9920,103,10080,93.3C10240,84,10400,56,10560,42C10720,28,10880,28,11040,37.3C11200,47,11360,65,11440,74.7L11520,84L11520,140L11440,140C11360,140,11200,140,11040,140C10880,140,10720,140,10560,140C10400,140,10240,140,10080,140C9920,140,9760,140,9600,140C9440,140,9280,140,9120,140C8960,140,8800,140,8640,140C8480,140,8320,140,8160,140C8000,140,7840,140,7680,140C7520,140,7360,140,7200,140C7040,140,6880,140,6720,140C6560,140,6400,140,6240,140C6080,140,5920,140,5760,140C5600,140,5440,140,5280,140C5120,140,4960,140,4800,140C4640,140,4480,140,4320,140C4160,140,4000,140,3840,140C3680,140,3520,140,3360,140C3200,140,3040,140,2880,140C2720,140,2560,140,2400,140C2240,140,2080,140,1920,140C1760,140,1600,140,1440,140C1280,140,1120,140,960,140C800,140,640,140,480,140C320,140,160,140,80,140L0,140Z"
              className="fill-current"
            ></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="absolute inset-x-0 top-25 z-10 ">
        <div className="max-w-4xl mx-auto px-6  ">
          <motion.div
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-8 md:p-12"
          >
            <motion.div variants={fadeIn} className="flex justify-center mb-8">
              <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <AlertCircle size={42} />
              </div>
            </motion.div>

            <motion.h1
              variants={fadeIn}
              className="text-4xl font-bold text-center mb-4"
            >
              {title}
            </motion.h1>

            <motion.div
              variants={fadeIn}
              className="w-20 h-1 bg-purple-200 mx-auto mb-6 rounded-full"
            ></motion.div>

            <motion.p
              variants={fadeIn}
              className="text-gray-600 text-center text-xl mb-8"
            >
              {message}
            </motion.p>

            <motion.div variants={fadeIn} className="flex justify-center gap-4">
              <GlowButton onClick={handleRefresh} className="px-6 py-3" primary>
                <RotateCw className="mr-2 inline-block" size={20} />
                Refresh
              </GlowButton>
              <GlowButton onClick={handleGoBack} className="px-6 py-3" primary>
                <ArrowLeft className="mr-2 inline-block" size={20} />
                Go Back
              </GlowButton>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="pt-56">
        <Footer />
      </div>
    </div>
  );
};

export default ErrorPage;