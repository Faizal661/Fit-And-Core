import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AUTH_MESSAGES } from "../../../constants/auth.messages";
import userLoginImage from "../../../assets/images/image1.jpg";
import LoginBody from "../../../components/auth/LoginBody";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type OtpFormData, otpSchema } from "../../../schemas/authSchema";

import {
  verifyOtp,
  ResendOtp,
  createUser,
} from "../../../services/authService";
import { useToast } from "../../../context/ToastContext";
import Footer from "../../../components/shared/Footer";
import { STATUS } from "../../../constants/status.messges";

const SignUpOtpVerification = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const otpInputRef = useRef<HTMLInputElement>(null);
  const [activeIndex, setActiveIndex] = useState(0); // Track the active OTP box

  const [serverError, setServerError] = useState("");
  const { showToast } = useToast();

  const registrationData = JSON.parse(
    localStorage.getItem("registrationData") || "{}"
  );

  useEffect(() => {
    if (!registrationData.email) {
      navigate("/signup");
    }
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
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

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [timeLeft]);

  const handleOtpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 6);
    setValue("otp", value);
    setActiveIndex(value.length);
  };

  const handleResendOtp = () => {
    setTimeLeft(60);
    setIsResendDisabled(true);
    setServerError("");
    setValue("otp", "");
    ResendOtp(registrationData.email);
    showToast(STATUS.INFO, AUTH_MESSAGES.OTP_RESENT);
  };

  const handleBoxClick = (index: number) => {
    if (otpInputRef.current) {
      otpInputRef.current.focus();
      setActiveIndex(index);
    }
  };

  const onSubmit = (data: OtpFormData) => {
    verifyOtpMutation.mutate({ email: registrationData.email, otp: data.otp });
  };

  return (
    <div>
      <LoginBody
        imageSrc={userLoginImage}
        welcomeMessage={AUTH_MESSAGES.ENTER_OTP}
      >
        <div className=" p-6  w-96">
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              {...register("otp")}
              ref={(e) => {
                register("otp").ref(e);
                otpInputRef.current = e;
              }}
              type="text"
              value={currentOtp}
              onChange={handleOtpChange}
              maxLength={6}
              className="absolute opacity-0 pointer-events-none"
              autoFocus
            />

            <div className="flex justify-center mt-4 gap-4">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  onClick={() => handleBoxClick(index)}
                  className={`w-12 h-12 flex items-center justify-center border text-lg cursor-pointer ${
                    errors.otp
                      ? "border-red-500"
                      : activeIndex === index
                      ? "border-slate-500 bg-cyan-400"
                      : "border-gray-300 hover:border-gray-500"
                  }
                ${serverError && "border-red-500"}`}
                >
                  {currentOtp?.[index] || ""}
                </div>
              ))}
            </div>

            {(errors.otp || serverError) && (
              <p className="text-red-500 mt-2 text-sm">
                {errors.otp?.message || serverError}
              </p>
            )}

            <div className="flex justify-between items-center mt-8">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResendDisabled}
                className={`${
                  isResendDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                Resend OTP
              </button>
              <span className="">{timeLeft}s</span>
            </div>

            <button
              type="submit"
              className="mt-10 w-full border-1  py-2 hover:bg-black"
            >
              Submit OTP
            </button>
          </form>
        </div>
      </LoginBody>
      <Footer />
    </div>
  );
};

export default SignUpOtpVerification;
