import React from 'react';
import LoginBody from '../../components/auth/LoginBody';
import adminLoginImage from '../../assets/images/img3.jpg';

const AdminLogin: React.FC = () => {
  return (
    <LoginBody imageSrc={adminLoginImage} welcomeMessage={''}>
      <form className="w-full max-w-md">
        <input type="email" placeholder="Admin Email" className="input-field" />
        <input type="password" placeholder="Admin Password" className="input-field" />
        <button className="btn-primary">Login</button>
      </form>
    </LoginBody>
  );
};

export default AdminLogin;
