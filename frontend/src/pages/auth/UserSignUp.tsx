import React from 'react';
import LoginBody from '../../components/auth/LoginBody';
import userSignUpImage from '../../assets/images/img4.jpg';
import { Link } from 'react-router-dom';
import {AUTH_MESSAGES} from '../../constants/auth.messages'
import Google from '../../assets/icons/Google';
import { Facebook } from 'lucide-react';


const Signup: React.FC = () => {

  return (
    <LoginBody imageSrc={userSignUpImage} welcomeMessage={AUTH_MESSAGES.SIGNUP_MESSAGE}>
    <form className="w-full max-w-md flex flex-col  ">
        <label htmlFor="name" className="text-slate-400">USER NAME</label>
        <input type="text" id="name" className=" border-b-1 border-white mt-2 outline-0 text" />
        <label htmlFor="email" className="text-slate-400 mt-4">EMAIL ADDRESS</label>
        <input type="email" id="email" className=" border-b-1 border-white mt-2 outline-0 text" />
        <label htmlFor="password" className="mt-4 text-slate-400">
          PASSWORD
        </label>
        <input type="password" id="password" className="border-b-1 border-white mt-2 outline-0" />
      
        <p className="text-light mt-6">
        Already have an account?{" "}
          <Link to={"/login"} className="underline">
          Log in
          </Link>
        </p>
        <button className="btn-primary mt-10 border-1 rounded-4xl py-2">
          <Link to={'/otp-verify'}>
          Sign Up
          </Link>
        </button>
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

export default Signup;   
