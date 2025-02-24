import React from 'react';
import LoginBody from '../../components/auth/LoginBody';
import userLoginImage from '../../../public/images/image1.jpg';
import { Link } from 'react-router-dom';

const UserLogin: React.FC = () => {
  return (
    <LoginBody imageSrc={userLoginImage}>
      <form className="w-full max-w-md flex flex-col  text-slate-400">
        <label htmlFor="email" >EMAIL ADDRESS</label>
        <input type="email" id='email' className=" border-b-1" />
        <label htmlFor="password" className='mt-4'>PASSWORD</label>
        <input type="password" id='password' className="border-b-1" />
        <p className='text-light mt-6'>Forget Password ? <Link to={''} className='underline'>Click here</Link></p>
        <p className='text-light mt-2'>New Here ? <Link to={''} className='underline'>Sign Up</Link></p>
        <button className="btn-primary mt-14 border-1 rounded-4xl py-2">Login</button>
      </form>
    </LoginBody>
  );
};

export default UserLogin;