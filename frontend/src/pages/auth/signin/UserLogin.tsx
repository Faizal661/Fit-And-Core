import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Dumbbell,
  Heart,
  Users,
  Award,
} from "lucide-react";
import { loginSchema, type LoginFormData } from "../../../schemas/authSchema";
import { loginUser } from "../../../services/authService";
import { setAuth } from "../../../redux/slices/authSlice";
import { useToast } from "../../../context/ToastContext";
import { useGoogleAuth } from "../../../hooks/useGoogleAuth";
import { AUTH_MESSAGES } from "../../../constants/messages/auth.messages";
import { STATUS } from "../../../constants/messages/status.messages";
import Footer from "../../../components/shared/footer";
import axios from "axios";

// Animation variants
const fadeIn = {
  // hidden: { opacity: 0, y: 20 },
  // visible: {
  //   opacity: 1,
  //   y: 0,
  //   transition: {
  //     duration: 0.6,
  //     ease: [0.25, 0.1, 0.25, 1],
  //   },
  // },
};

const staggerContainer = {
  // hidden: { opacity: 0 },
  // visible: {
  //   opacity: 1,
  //   transition: {
  //     staggerChildren: 0.1,
  //   },
  // },
};

const slideInLeft = {
  // hidden: { opacity: 0, x: -60 },
  // visible: {
  //   opacity: 1,
  //   x: 0,
  //   transition: {
  //     duration: 0.8,
  //     ease: [0.25, 0.1, 0.25, 1],
  //   },
  // },
};

const slideInRight = {
  // hidden: { opacity: 0, x: 0 },
  // visible: {
  //   opacity: 1,
  //   x: 0,
  //   transition: {
  //     duration: 0.8,
  //     ease: [0.25, 0.1, 0.25, 1],
  //   },
  // },
};

const UserLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { handleGoogleLogin } = useGoogleAuth();
  const { showToast } = useToast();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (localStorage.getItem("sessionExpired")) {
      showToast(STATUS.WARNING, AUTH_MESSAGES.SESSION_EXPIRED);
      localStorage.removeItem("sessionExpired");
    } else if (localStorage.getItem("blocked")) {
      showToast(STATUS.WARNING, AUTH_MESSAGES.ACCOUNT_BLOCKED);
      localStorage.removeItem("blocked");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      dispatch(
        setAuth({
          user: data.user,
          accessToken: data.accessToken,
        })
      );
      showToast(STATUS.SUCCESS, AUTH_MESSAGES.LOGIN_SUCCESS);
      navigate(`/${data.user.role}`);
    },
    onError: (error: Error) => {
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data.message || AUTH_MESSAGES.SERVER_ERROR
        );
      } else {
        setServerError(AUTH_MESSAGES.SERVER_ERROR);
      }
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setServerError("");
    loginMutation.mutate(data);
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === "Google") {
      handleGoogleLogin();
    }
  };

  const features = [
    {
      icon: <Dumbbell className="text-blue-500" size={24} />,
      title: "Expert Training",
      description: "Connect with certified fitness professionals",
    },
    {
      icon: <Heart className="text-red-500" size={24} />,
      title: "Health Tracking",
      description: "Monitor your progress and wellness journey",
    },
    {
      icon: <Users className="text-emerald-500" size={24} />,
      title: "Community",
      description: "Join fitness groups and stay motivated",
    },
    {
      icon: <Award className="text-amber-500" size={24} />,
      title: "Achievements",
      description: "Unlock milestones and celebrate success",
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
          className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-900/95 via-purple-900/95 to-emerald-900/95 overflow-hidden"
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
                  Welcome to{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    FIT&CORE
                  </span>
                </h1>
                <p className="text-xl text-white/90 leading-relaxed">
                  Transform your fitness journey with personalized training,
                  expert guidance, and a supportive community.
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

        {/* Right Side - Login Form */}
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
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Dumbbell className="text-white" size={28} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-600">
                  Sign in to continue your fitness journey
                </p>
              </motion.div>

              {/* Login Form */}
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
                      placeholder="Enter your email"
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

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      className={`w-full px-4 py-3 pl-12 pr-12 rounded-lg border ${
                        errors.password
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      } focus:ring-2 focus:outline-none transition-all duration-300`}
                      placeholder="Enter your password"
                    />
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Server Error */}
                {serverError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <p className="text-red-600 text-sm">{serverError}</p>
                  </motion.div>
                )}

                {/* Links */}
                <div className="flex items-center justify-between text-sm">
                  <Link
                    to="/forget-password"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Forgot Password?
                  </Link>
                  <Link
                    to="/signup"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Create Account
                  </Link>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting || loginMutation.isPending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    isSubmitting || loginMutation.isPending
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/25 text-white"
                  }`}
                >
                  {isSubmitting || loginMutation.isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-gray-50 text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Google Login */}
                <motion.button
                  type="button"
                  onClick={() => handleSocialLogin("Google")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-6 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
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

export default UserLogin;
