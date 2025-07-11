import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { resetPassword } from "../../../services/authService";
import {
  type PasswordFormData,
  passwordSchema,
} from "../../../schemas/authSchema";
import { useToast } from "../../../context/ToastContext";
import { AUTH_MESSAGES } from "../../../constants/messages/auth.messages";
import Footer from "../../../components/shared/footer";
import { STATUS } from "../../../constants/messages/status.messages";
import { CheckCircle, Clock, Mail, Shield } from "lucide-react";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
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

const NewPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state as { email: string };
  const { showToast } = useToast();
  const [serverError, setServerError] = useState("");
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      navigate("/login");
      showToast(STATUS.SUCCESS, AUTH_MESSAGES.PASSWORD_RESET_SUCCESS);
    },
    onError: () => {
      showToast(STATUS.ERROR, AUTH_MESSAGES.SERVER_ERROR);
      setServerError(AUTH_MESSAGES.SERVER_ERROR);
    },
  });

  const onSubmit = (values: PasswordFormData) => {
    setServerError("");
    mutation.mutate({ email, password: values.password });
  };

  
    const features = [
      {
        icon: <Shield className="text-blue-500" size={24} />,
        title: "Secure Verification",
        description: "Your code is encrypted and time-limited for security",
      },
      {
        icon: <Mail className="text-emerald-500" size={24} />,
        title: "Email Sent",
        description: `Verification code sent to ${email}`,
      },
      {
        icon: <Clock className="text-purple-500" size={24} />,
        title: "Quick Process",
        description: "Complete verification in just a few seconds",
      },
      {
        icon: <CheckCircle className="text-green-500" size={24} />,
        title: "Almost Done",
        description: "One step closer to resetting your password",
      },
    ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
            <div className="flex min-h-screen">

          {/* Left Side - Hero Section */}
          <motion.div
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={slideInLeft}
            className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-emerald-900/95 via-blue-900/95 to-purple-900/95 overflow-hidden"
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
                    Verify Your{" "}
                    <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                      Identity
                    </span>
                  </h1>
                  <p className="text-xl text-white/90 leading-relaxed">
                    We've sent a secure 6-digit verification code to your email.
                    Enter it below to continue with your password reset.
                  </p>
                </motion.div>

                <motion.div
                  variants={fadeIn}
                  className="grid grid-cols-1 gap-6"
                >
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

          {/* Left Side - Image */}
          {/* <motion.div
            variants={slideInLeft}
            className="w-full lg:w-1/2 max-w-lg"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/placeholder.svg"
                alt="Set New Password"
                className="w-full h-[400px] lg:h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/30 to-transparent"></div>
            </div>
          </motion.div> */}

          {/* Right Side - Form */}
          <motion.div
            variants={slideInRight}
            className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16"
          >
          <div className="w-full max-w-md">
              <motion.div variants={fadeIn} className="text-center mb-8">
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                  Set New Password
                </h1>
                <p className="text-gray-600">
                  Create a strong password for your account
                </p>
              </motion.div>

              <motion.form
                variants={fadeIn}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    New Password
                  </label>
                  <input
                    {...register("password")}
                    type="password"
                    id="password"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:outline-none transition-all duration-300 ${
                      errors.password
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                    }`}
                    placeholder="Enter new password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirm Password
                  </label>
                  <input
                    {...register("confirmPassword")}
                    type="password"
                    id="confirmPassword"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:outline-none transition-all duration-300 ${
                      errors.confirmPassword
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                    }`}
                    placeholder="Confirm new password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {serverError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{serverError}</p>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting || mutation.isPending}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting || mutation.isPending
                    ? "Resetting Password..."
                    : "Reset Password"}
                </motion.button>
              </motion.form>
            </div>
          </motion.div>
        </div>
      <Footer />
    </div>
  );
};

export default NewPassword;
