import React from "react";


interface LoginBodyProps {
  children: React.ReactNode;
  imageSrc: string;
  welcomeMessage:string
}

const LoginBody: React.FC<LoginBodyProps> = ({ children, imageSrc,welcomeMessage }) => {

  return (
    <div >
      <div className="flex h-screen">
        <div className="w-1/2 bg-gray-200 items-center justify-center hidden md:block">
          <img
            src={imageSrc}
            alt="User Login"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-10 bg-[#2916BA] text-white">
          <h1 className="text-2xl font-medium mb-16 w-full max-w-md">{welcomeMessage}</h1>
          {children}
        </div>
      </div>
    </div>
  );
};

export default LoginBody;
