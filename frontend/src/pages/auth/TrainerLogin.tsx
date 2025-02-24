import React from 'react';
import LoginBody from '../../components/auth/LoginBody';
import trainerLoginImage from '../../../public/images/img4.jpg';


const TrainerLogin: React.FC = () => {
  return (
    <LoginBody imageSrc={trainerLoginImage}>
      <form className="w-full max-w-md">
        <h1>Trainer</h1>
        <input type="email" placeholder="Email" className="input-field" />
        <input type="password" placeholder="Password" className="input-field" />
        <button className="btn-primary">Login</button>
      </form>
    </LoginBody>
  );
};

export default TrainerLogin;
