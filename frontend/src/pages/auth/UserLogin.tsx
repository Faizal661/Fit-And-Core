import React from "react";
import LoginBody from "../../components/auth/LoginBody";
import userLoginImage from "../../assets/images/image1.jpg";
import { Link } from "react-router-dom";
import {AUTH_MESSAGES} from '../../constants/welcome.messages'

const UserLogin: React.FC = () => {
  return (
    <LoginBody imageSrc={userLoginImage} welcomeMessage={AUTH_MESSAGES.LOGIN_MESSAGE}>
      <form className="w-full max-w-md flex flex-col  ">
        <label htmlFor="email" className="text-slate-400">EMAIL ADDRESS</label>
        <input type="email" id="email" className=" border-b-1 border-white mt-2 outline-0 text" />
        <label htmlFor="password" className="mt-4 text-slate-400">
          PASSWORD
        </label>
        <input type="password" id="password" className="border-b-1 border-white mt-2 outline-0" />
        <p className="text-light mt-6">
          Forget Password ?{" "}
          <Link to={"/reset-password"} className="underline">
            Click here
          </Link>
        </p>
        <p className="text-light mt-2">
          New Here ?{" "}
          <Link to={"/signup"} className="underline">
            Sign Up
          </Link>
        </p>
        <button className="btn-primary mt-14 border-1 rounded-4xl py-2">
          Log In
        </button>
      </form>
    </LoginBody>
  );
};

export default UserLogin;
