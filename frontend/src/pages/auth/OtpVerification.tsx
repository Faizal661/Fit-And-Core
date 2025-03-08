import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
import { AUTH_MESSAGES } from "../../constants/auth.messages";
import userLoginImage from "../../assets/images/image1.jpg";
import LoginBody from "../../components/auth/LoginBody";

import { useMutation } from "@tanstack/react-query";
import { verifyOtp, sendOtp } from "../../services/authService";
import { useSignupContext } from "../../context/SignupContext";

const OtpVerification= ({onSuccess,}: {onSuccess: () => void;}) => {
  const [otp, setOtp] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const otpInputRef = useRef<HTMLInputElement>(null);
  // const navigate = useNavigate();

  const { userData } = useSignupContext();
  const mutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: () => onSuccess(),
    onError: () => alert("Invalid OTP"),
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
    setOtp(value);
  };

  // handle otp resend function
  const handleResendOtp = () => {
    setTimeLeft(60);
    setIsResendDisabled(true);
    setOtp("");
    sendOtp(userData?.email ?? "");
    alert("OTP Resent!");
  };

  const handleSubmit = () => {
    if (otp.length === 6) {
      // call the top verifying functino here 
      console.log(otp);
    } else {
      console.log(otp);
      alert("Please enter a valid 6-digit OTP");
    }
  };

  const handleBoxClick = () => {
    console.log("focus on otp");
    otpInputRef.current?.focus();
  };

  return (
    <LoginBody
      imageSrc={userLoginImage}
      welcomeMessage={AUTH_MESSAGES.ENTER_OTP}
    >
      <div className=" p-6  w-96">
        <input
          ref={otpInputRef}
          type="text"
          value={otp}
          onChange={handleOtpChange}
          maxLength={6}
          className="absolute opacity-0 pointer-events-none"
          autoFocus
        />

        <div
          className="flex justify-center mt-4 gap-4 "
          onClick={handleBoxClick}
        >
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="w-12 h-12 flex items-center justify-center border rounded-md text-lg cursor-pointer"
            >
              {otp[index] || ""}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-8">
          <button
            // onClick={resendOtp}
            onClick={handleResendOtp}
            disabled={isResendDisabled}
            className={` ${
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
          // onClick={handleSubmit}
          className="mt-10 w-full  border-1 rounded-4xl py-2 hover:bg-blue-900"
          onClick={() => mutation.mutate({ email: userData?.email ?? "", otp })}
        >
          Submit OTP
        </button>
      </div>
    </LoginBody>
  );
};

export default OtpVerification;

