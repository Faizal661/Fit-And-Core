// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import userLoginImage from "../../assets/images/image1.jpg";
// import { AUTH_MESSAGES } from "../../constants/auth.messages";
// import LoginBody from "../../components/auth/LoginBody";

// const OtpVerification: React.FC = () => {
//   const [otp, setOtp] = useState<string>("");
//   const [timeLeft, setTimeLeft] = useState<number>(60);
//   const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (timeLeft > 0) {
//       const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
//       return () => clearTimeout(timer);
//     } else {
//       setIsResendDisabled(false);
//     }
//   }, [timeLeft]);

//   const handleOtpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const value = event.target.value.replace(/\D/g, "").slice(0, 6);
//     setOtp(value);
//   };

//   const handleResendOtp = () => {
//     setTimeLeft(60);
//     setIsResendDisabled(true);
//     setOtp("");
//   };

//   const handleSubmit = () => {
//     if (otp.length === 6) {
//       navigate("/set-password");
//       console.log(otp);
//     } else {
//       console.log(otp);
//       // alert("Please enter a valid 6-digit OTP");
//     }
//   };

//   const handleBoxClick = () => {
//     inputRef.current?.focus();
//   };

//   return (
//     <LoginBody
//       imageSrc={userLoginImage}
//       welcomeMessage={AUTH_MESSAGES.ENTER_OTP}
//     >
//       <div className=" p-6  w-96">
//         <input
//           ref={inputRef}
//           type="text"
//           value={otp}
//           onChange={handleOtpChange}
//           maxLength={6}
//           className="absolute opacity-0 pointer-events-none"
//           autoFocus
//         />

//         <div className="flex justify-center mt-4 gap-4" onClick={handleBoxClick}>
//           {[...Array(6)].map((_, index) => (
//             <div
//               key={index}
//               className="w-12 h-12 flex items-center justify-center border rounded-md text-lg cursor-pointer"
//             >
//               {otp[index] || ""}
//             </div>
//           ))}
//         </div>

//         <div className="flex justify-between items-center mt-8">
//           <button
//             onClick={handleResendOtp}
//             disabled={isResendDisabled}
//             className={` ${
//               isResendDisabled
//                 ? "opacity-50 cursor-not-allowed"
//                 : "cursor-pointer"
//             }`}
//           >
//             Resend OTP
//           </button>
//           <span className="">{timeLeft}s</span>
//         </div>

//         <button
//           onClick={handleSubmit}
//           className="mt-10 w-full  border-1 rounded-4xl py-2 hover:bg-blue-900"
//         >
//           Submit OTP
//         </button>
//       </div>
//     </LoginBody>
//   );
// };

// export default OtpVerification;

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { verifyOtp, sendOtp } from "../../services/authService";
import { useSignupContext } from "../../context/SignupContext";

const OtpVerification = ({ onSuccess }: { onSuccess: () => void }) => {
  const { userData } = useSignupContext();
  const [otp, setOtp] = useState("");

  const mutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: () => onSuccess(),
    onError: () => alert("Invalid OTP"),
  });

  const resendOtp = () => {
    sendOtp(userData?.email ?? "");
    alert("OTP Resent!");
  };

  return (
    <div>
      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        maxLength={6}
      />
      <button
        onClick={() => mutation.mutate({ email: userData?.email ?? "", otp })}
      >
        Submit OTP
      </button>
      <button onClick={resendOtp}>Resend OTP</button>
    </div>
  );
};

export default OtpVerification;
