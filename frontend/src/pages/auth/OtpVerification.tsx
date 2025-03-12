import { useState, useEffect, useRef } from "react";
import { AUTH_MESSAGES } from "../../constants/auth.messages";
import userLoginImage from "../../assets/images/image1.jpg";
import LoginBody from "../../components/auth/LoginBody";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type OtpFormData, otpSchema } from "../../schemas/authSchema";

import { verifyOtp, sendOtp } from "../../services/authService";
import { useSignupContext } from "../../context/SignupContext";
import { useToast } from "../../context/ToastContext";

interface OtpFormProps {
  onSuccess: () => void;
}

const OtpVerification: React.FC<OtpFormProps> = ({ onSuccess }) => {
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const otpInputRef = useRef<HTMLInputElement>(null);

  const { userData } = useSignupContext();
  const [serverError, setServerError] = useState("");
  const {showToast}=useToast()

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


  const mutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      if (data.success) {
        onSuccess();
      } else {
        setServerError("Invalid OTP code");
      }
    },
    onError: () => {
      setServerError("Server error, please try again");
      showToast('error',"Server error, please try again")

    },
  });

  // manage resend otp btn enable, and timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [timeLeft]);

  // otp input value
  const handleOtpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 6);
    setValue("otp", value);
  };

  // handle otp resend function
  const handleResendOtp = () => {
    setTimeLeft(60);
    setIsResendDisabled(true);
    setValue("otp", "");
    sendOtp(userData?.email ?? "");
    alert("OTP Resent!");
  };

  const handleBoxClick = () => {
    otpInputRef.current?.focus();
  };

  const onSubmit = (data: OtpFormData) => {
    mutation.mutate({ email: userData?.email ?? "", otp: data.otp });
  };

  return (
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

          <div
            className="flex justify-center mt-4 gap-4"
            onClick={handleBoxClick}
          >
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className={`w-12 h-12 flex items-center justify-center border rounded-md text-lg cursor-pointer ${
                  errors.otp ? "border-red-500" : ""
                }`}
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
            className="mt-10 w-full border-1 rounded-4xl py-2 hover:bg-blue-900"
          >
            Submit OTP
          </button>
        </form>
      </div>
    </LoginBody>
  );
};

export default OtpVerification;
