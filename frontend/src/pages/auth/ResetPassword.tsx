import React from "react";
import LoginBody from "../../components/auth/LoginBody";
import userLoginImage from "../../assets/images/image1.jpg";
import { Link } from "react-router-dom";
import {AUTH_MESSAGES} from '../../constants/welcome.messages'


const ResetPassword: React.FC  = () => {
  return (
    <LoginBody imageSrc={userLoginImage} welcomeMessage={AUTH_MESSAGES.RESET_PASSWORD_MESSAGE}>
    <form className="w-full max-w-md flex flex-col  ">
      <label htmlFor="email" className="text-slate-400">EMAIL ADDRESS</label>
      <input type="email" id="email" className=" border-b-1 border-white mt-2 outline-0 text" />
     
      <p className="text-light mt-8">
        Back to Login{" "}
        <Link to={"/login"} className="underline">
          Click here!
        </Link>
      </p>
      <button className="btn-primary mt-14 border-1 rounded-4xl py-2">
        <Link to={"/otp-verify"}>
          Send OTP
        </Link>
      </button>
    </form>
  </LoginBody>
  )
}

export default ResetPassword

