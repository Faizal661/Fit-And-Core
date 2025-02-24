import React from 'react';

const LoginBody: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-gray-200 flex items-center justify-center">
        <img src="/assets/login-image.png" alt="Login" className="w-3/4 h-auto" />
      </div>
      <div className="w-1/2 flex flex-col justify-center items-center p-10">
        <h1 className="text-3xl font-bold mb-4">Welcome to Fit & Core</h1>
        {children}
      </div>
    </div>
  );
};

export default LoginBody;

