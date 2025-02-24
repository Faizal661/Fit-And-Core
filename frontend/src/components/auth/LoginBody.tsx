import React from 'react';

interface LoginBodyProps {
  children: React.ReactNode;
  imageSrc: string;
}

const LoginBody: React.FC<LoginBodyProps> = ({ children, imageSrc }) => {
  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-gray-200 flex items-center justify-center">
        <img src={imageSrc} alt="User Login" className="w-full h-full object-cover" />
      </div>
      <div className="w-1/2 flex flex-col justify-center items-center p-10 bg-[#2916BA] text-white">
        <h1 className="text-3xl font-medium mb-16">Welcome to Fit & Core</h1>
        {children}
      </div>
    </div>
  );
};

export default LoginBody;
