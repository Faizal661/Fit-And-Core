import React from 'react';
import LoginBody from '../../components/auth/LoginBody';

const TrainerLogin: React.FC = () => {
  return (
    <LoginBody>
      <form className="w-full max-w-md">
        <input type="email" placeholder="Email" className="input-field" />
        <input type="password" placeholder="Password" className="input-field" />
        <button className="btn-primary">Login</button>
      </form>
    </LoginBody>
  );
};

export default TrainerLogin;
