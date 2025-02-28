import React from 'react';
import LoginBody from '../../components/auth/LoginBody';
import userSignUpImage from '../../assets/images/img4.jpg';
import { Link } from 'react-router-dom';
import {AUTH_MESSAGES} from '../../constants/welcome.messages'


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
        <button className="btn-primary mt-14 border-1 rounded-4xl py-2">
          Sign Up
        </button>
      </form>
    </LoginBody>
  );
};

export default Signup;   
