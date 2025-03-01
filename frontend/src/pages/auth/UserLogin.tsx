import React from "react";
import LoginBody from "../../components/auth/LoginBody";
import userLoginImage from "../../assets/images/image1.jpg";
import { Link } from "react-router-dom";
import { AUTH_MESSAGES } from "../../constants/auth.messages";
import { Facebook } from "lucide-react";
import Google from "../../assets/icons/Google";

const UserLogin: React.FC = () => {
  return (
    <LoginBody
      imageSrc={userLoginImage}
      welcomeMessage={AUTH_MESSAGES.LOGIN_MESSAGE}
    >
      <form className="w-full max-w-md flex flex-col  ">
        <label htmlFor="email" className="text-slate-400">
          EMAIL ADDRESS
        </label>
        <input
          type="email"
          id="email"
          className=" border-b-1 border-white mt-2 outline-0 text"
        />
        <label htmlFor="password" className="mt-4 text-slate-400">
          PASSWORD
        </label>
        <input
          type="password"
          id="password"
          className="border-b-1 border-white mt-2 outline-0"
        />
        <p className="text-light mt-6">
          Forget Password ?{" "}
          <Link to={"/forget-password"} className="underline">
            Click here
          </Link>
        </p>
        <p className="text-light mt-2">
          New Here ?{" "}
          <Link to={"/signup"} className="underline">
            Sign Up
          </Link>
        </p>
        <button className=" mt-14 border-1 rounded-4xl py-2 hover:bg-blue-800">Log In</button>
        <div className="flex mt-6 border-b-1 border-slate-400 "></div>
        <div className="flex mt-6 gap-3">
          <button className="flex w-full border-1 rounded-4xl border-slate-400 p-2 px-5 justify-center items-center gap-4">
            <Google />
            Google
          </button>
          <button className="flex w-full border-1 rounded-4xl py-2 px-5 border-slate-400 justify-center items-center gap-4">
            <Facebook strokeWidth={.1} fill="white" color="white"/>
            Facebook
          </button>
        </div>
      </form>
    </LoginBody>
  );
};

export default UserLogin;
