import React from 'react';
import LoginBody from '../../components/auth/LoginBody';

const Signup: React.FC = () => {
  return (
    <LoginBody>
      <form className="w-full max-w-md">
        <input type="text" placeholder="Full Name" className="input-field" />
        <input type="email" placeholder="Email" className="input-field" />
        <input type="password" placeholder="Password" className="input-field" />
        <button className="btn-primary">Sign Up</button>
      </form>
    </LoginBody>
  );
};

export default Signup;
