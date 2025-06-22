import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Mail,
  ArrowRight,
  Dumbbell,
  Heart,
  Shield,
} from "lucide-react";
import { emailSchema, type EmailFormData } from "../../../schemas/authSchema";
import { isValidEmail } from "../../../services/authService";
import { useToast } from "../../../context/ToastContext";
import { AUTH_MESSAGES } from "../../../constants/messages/auth.messages";
import { STATUS } from "../../../constants/messages/status.messages";
import Footer from "../../../components/shared/Footer";
import axios from "axios";

// Animation variants
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

const EmailVerify = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const emailMutation = useMutation({
    mutationFn: isValidEmail,
    onSuccess: (data) => {
      if (data.isValid) {
        navigate("/otp-verify", { state: { email: data.email } });
      } else {
        showToast(STATUS.ERROR, AUTH_MESSAGES.INVALID_EMAIL);
      }
    },
    onError: (error: Error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          showToast(STATUS.ERROR, AUTH_MESSAGES.INVALID_EMAIL);
        } else {
          showToast(
            STATUS.ERROR,
            error.response?.data.message || AUTH_MESSAGES.SERVER_ERROR
          );
        }
      }
    },
  });

  const onSubmit = (data: EmailFormData) => {
    emailMutation.mutate({ email: data.email });
  };

  const features = [
    {
      icon: <Shield className="text-blue-500" size={24} />,
      title: "Secure Reset",
      description: "Your account security is our top priority",
    },
    {
      icon: <Mail className="text-emerald-500" size={24} />,
      title: "Email Verification",
      description: "We'll send a secure OTP to your email",
    },
    {
      icon: <Dumbbell className="text-purple-500" size={24} />,
      title: "Quick Access",
      description: "Get back to your fitness journey in minutes",
    },
    {
      icon: <Heart className="text-red-500" size={24} />,
      title: "Support Ready",
      description: "Our team is here to help if you need assistance",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden z-51">
      <div className="flex min-h-screen">
        {/* Left Side - Hero Section */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={slideInLeft}
          className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-purple-900/95 via-blue-900/95 to-emerald-900/95 overflow-hidden"
        >
          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          ></div>

          {/* Hero Content */}
          <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
            <motion.div variants={staggerContainer} className="space-y-8">
              <motion.div variants={fadeIn}>
                <h1 className="text-5xl font-bold mb-6">
                  Reset Your{" "}
                  <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Password
                  </span>
                </h1>
                <p className="text-xl text-white/90 leading-relaxed">
                  Don't worry! It happens to the best of us. Enter your email 
                  and we'll send you a secure OTP to reset your password.
                </p>
              </motion.div>

              <motion.div variants={fadeIn} className="grid grid-cols-1 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={fadeIn}
                    className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full animate-pulse"></div>
          <div className="absolute bottom-8 left-26 w-24 h-24 bg-white/5 rounded-full animate-pulse"></div>
        </motion.div>

        {/* Right Side - Email Form */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={slideInRight}
          className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16"
        >
          <div className="w-full max-w-md">
            <motion.div variants={staggerContainer} className="space-y-8">
              {/* Header */}
              <motion.div variants={fadeIn} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="text-white" size={28} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Reset Password
                </h2>
                <p className="text-gray-600">
                  Enter your email to receive a verification code
                </p>
              </motion.div>

              {/* Email Form */}
              <motion.form
                variants={fadeIn}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      {...register("email")}
                      type="email"
                      className={`w-full px-4 py-3 pl-12 rounded-lg border ${
                        errors.email
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      } focus:ring-2 focus:outline-none transition-all duration-300`}
                      placeholder="Enter your email address"
                    />
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Links */}
                <div className="flex items-center justify-center text-sm">
                  <span className="text-gray-600">Remember your password?</span>
                  <Link
                    to="/login"
                    className="ml-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Back to Login
                  </Link>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting || emailMutation.isPending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    isSubmitting || emailMutation.isPending
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg hover:shadow-purple-500/25 text-white"
                  }`}
                >
                  {isSubmitting || emailMutation.isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Send OTP</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>

              
              </motion.form>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default EmailVerify;