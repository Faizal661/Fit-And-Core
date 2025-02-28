import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OtpVerification: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const navigate = useNavigate();

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsResendDisabled(false);
    }
  }, [timeLeft]);

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (!isNaN(Number(value)) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input
      if (value !== "" && index < otp.length - 1) {
        (document.getElementById(`otp-${index + 1}`) as HTMLInputElement)?.focus();
      }
    }
  };

  // Resend OTP logic
  const handleResendOtp = () => {
    setTimeLeft(60);
    setIsResendDisabled(true);
    setOtp(new Array(6).fill(""));
  };

  // Submit OTP
  const handleSubmit = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length === 6) {
      navigate("/set-password");
    } else {
      alert("Please enter a valid 6-digit OTP");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center">Verify OTP</h2>
        <p className="text-gray-500 text-center mt-2">Enter the 6-digit OTP sent to your email</p>

        <div className="flex justify-center mt-4 gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              className="w-10 h-10 text-center border rounded-md text-lg"
            />
          ))}
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handleResendOtp}
            disabled={isResendDisabled}
            className={`text-blue-500 ${isResendDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Resend OTP
          </button>
          <span className="text-gray-600">{timeLeft}s</span>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Submit OTP
        </button>
      </div>
    </div>
  );
};

export default OtpVerification;
