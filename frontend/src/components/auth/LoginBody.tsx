import React from "react";
import LoginImage from "../../assets/images/image1.jpg";


interface LoginBodyProps {
  children: React.ReactNode;
  imageSrc: string;
  welcomeMessage:string
}

const LoginBody: React.FC<LoginBodyProps> = ({ children, imageSrc, welcomeMessage }) => {
  return (
    <div className="h-screen overflow-hidden"> {/* Added h-screen and overflow-hidden to the main container */}
      <div className="flex h-full"> {/* Changed h-screen to h-full for the flex container */}
        {/* Left Side Image */}
        <div className="w-1/2 bg-gray-200 items-center justify-center hidden md:flex">
          <img
            src={imageSrc}
            alt="User Login"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side with Blurred Background */}
        <div className="relative w-full md:w-1/2 flex flex-col justify-center items-center p-10 text-white">
          {/* Blurred Background Image */}
          <div
            className="absolute inset-0 z-0"
            style={{ backgroundImage: `url(${LoginImage})` }}
          ></div>
          <div className="relative z-10 w-full max-w-md">
            <h1 className="text-2xl font-medium mb-16">{welcomeMessage}</h1>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginBody;
