import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  UserPlus,
  Clock,
  ArrowRight,
  Shield,
  Mail,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { type OtpFormData, otpSchema } from "../../../schemas/authSchema";
import {
  verifyOtp,
  ResendOtp,
  createUser,
} from "../../../services/authService";
import { useToast } from "../../../context/ToastContext";
import { AUTH_MESSAGES } from "../../../constants/messages/auth.messages";
import { STATUS } from "../../../constants/messages/status.messages";
import Footer from "../../../components/shared/Footer";
import OtpInput from "../../../components/shared/otp/OtpInput";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
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
      ease: "easeOut",
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
      ease: "easeOut",
    },
  },
};

const SignUpOtpVerification = () => {
  const navigate = useNavigate();
  const processedRef = useRef(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [serverError, setServerError] = useState("");
  const { showToast } = useToast();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const registrationData = JSON.parse(
    localStorage.getItem("registrationData") || "{}"
  );

  useEffect(() => {
    if (processedRef.current) return;

    if (!registrationData.email) {
      processedRef.current = true;
      navigate("/signup");
      showToast(STATUS.ERROR, AUTH_MESSAGES.UNEXPECTED_ERROR);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const currentOtp = watch("otp");

  const verifyOtpMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      if (data.success) {
        createUserMutation.mutate({
          username: registrationData.username,
          email: registrationData.email,
          password: registrationData.password,
        });
      } else {
        setServerError(AUTH_MESSAGES.INVALID_OTP);
      }
    },
    onError: () => {
      setServerError(AUTH_MESSAGES.SERVER_ERROR);
      showToast(STATUS.ERROR, AUTH_MESSAGES.SERVER_ERROR);
    },
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      localStorage.removeItem("registrationData");
      navigate("/login");
      showToast(STATUS.SUCCESS, AUTH_MESSAGES.ACCOUNT_CREATED);
    },
    onError: () => {
      showToast(STATUS.ERROR, AUTH_MESSAGES.SERVER_ERROR);
      setServerError(AUTH_MESSAGES.SERVER_ERROR);
    },
  });

  const resendMutation = useMutation({
    mutationFn: ResendOtp,
    onSuccess: () => {
      setTimeLeft(60);
      setIsResendDisabled(true);
      setServerError("");
      setValue("otp", "");
      showToast(STATUS.SUCCESS, AUTH_MESSAGES.OTP_RESENT);
    },
    onError: () => {
      showToast(STATUS.ERROR, AUTH_MESSAGES.SERVER_ERROR);
    },
  });

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [timeLeft]);

  const handleOtpChange = (value: string) => {
    setValue("otp", value);
    setServerError("");
  };

  const handleResendOtp = () => {
    resendMutation.mutate(registrationData.email);
  };

  const onSubmit = (data: OtpFormData) => {
    setServerError("");
    verifyOtpMutation.mutate({ email: registrationData.email, otp: data.otp });
  };

  const features = [
    {
      icon: <UserPlus className="text-emerald-500" size={24} />,
      title: "Account Creation",
      description: "Final step to create your new account",
    },
    {
      icon: <Mail className="text-blue-500" size={24} />,
      title: "Email Verification",
      description: `Code sent to ${registrationData.email || "your email"}`,
    },
    {
      icon: <Shield className="text-purple-500" size={24} />,
      title: "Secure Process",
      description: "Your registration data is protected and encrypted",
    },
    {
      icon: <Sparkles className="text-pink-500" size={24} />,
      title: "Almost There",
      description: "One final step to join our community",
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
          className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-emerald-900/95 via-purple-900/95 to-pink-900/95 overflow-hidden"
        >
          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />

          {/* Hero Content */}
          <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
            <motion.div variants={staggerContainer} className="space-y-8">
              <motion.div variants={fadeIn}>
                <h1 className="text-5xl font-bold mb-6">
                  Complete Your{" "}
                  <span className="bg-gradient-to-r from-emerald-400 to-pink-400 bg-clip-text text-transparent">
                    Registration
                  </span>
                </h1>
                <p className="text-xl text-white/90 leading-relaxed">
                  We've sent a verification code to your email address. Enter it
                  below to activate your account and start your journey with us.
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
          <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-emerald-400/10 to-pink-400/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 right-10 w-16 h-16 bg-white/5 rounded-full animate-bounce"></div>
        </motion.div>

        {/* Right Side - OTP Form */}
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
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserPlus className="text-white" size={28} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Verify Your Email
                </h2>
                <p className="text-gray-600">
                  Enter the 6-digit code to complete registration
                </p>
              </motion.div>

              {/* OTP Form */}
              <motion.form
                variants={fadeIn}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* OTP Input */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 text-center">
                    Verification Code
                  </label>
                  <OtpInput
                    value={currentOtp}
                    onChange={handleOtpChange}
                    error={!!errors.otp || !!serverError}
                    disabled={
                      isSubmitting ||
                      verifyOtpMutation.isPending ||
                      createUserMutation.isPending
                    }
                    autoFocus
                  />
                  {(errors.otp || serverError) && (
                    <p className="text-red-500 text-sm text-center">
                      {errors.otp?.message || serverError}
                    </p>
                  )}
                </div>

                {/* Timer and Resend */}
                <motion.div
                  variants={fadeIn}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResendDisabled || resendMutation.isPending}
                    className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                      isResendDisabled || resendMutation.isPending
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-emerald-600 hover:text-emerald-700 hover:cursor-pointer"
                    }`}
                  >
                    <RefreshCw
                      size={14}
                      className={resendMutation.isPending ? "animate-spin" : ""}
                    />
                    {resendMutation.isPending ? "Sending..." : "Resend Code"}
                  </button>

                  {timeLeft !== 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={16} />

                      <span>Resend otp in {timeLeft}s</span>
                    </div>
                  )}
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    verifyOtpMutation.isPending ||
                    createUserMutation.isPending ||
                    !currentOtp ||
                    currentOtp.length !== 6
                  }
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    isSubmitting ||
                    verifyOtpMutation.isPending ||
                    createUserMutation.isPending ||
                    !currentOtp ||
                    currentOtp.length !== 6
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-gradient-to-r from-emerald-600 to-pink-600 hover:shadow-lg hover:shadow-emerald-500/25 text-white"
                  }`}
                >
                  {isSubmitting || verifyOtpMutation.isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Verifying Code...</span>
                    </>
                  ) : createUserMutation.isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>

                {/* Additional Info */}
                <motion.div
                  variants={fadeIn}
                  className="text-center p-3 mt-15  bg-blue-50 rounded-lg border border-blue-200"
                >
                  <p className="text-blue-700 text-sm ">
                    💡 Didn't receive the code? Check your spam folder or wait
                    for the timer to expire before requesting a new one.
                  </p>
                </motion.div>
              </motion.form>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default SignUpOtpVerification;
