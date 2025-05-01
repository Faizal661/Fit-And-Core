import React from "react";
import LoginImage from "../../assets/images/image1.jpg";
import { motion } from "framer-motion";

interface LoginBodyProps {
  children: React.ReactNode;
  imageSrc: string;
  welcomeMessage: string;
}

const LoginBody: React.FC<LoginBodyProps> = ({
  children,
  imageSrc,
  welcomeMessage,
}) => {
  return (
    <motion.div
      className="h-screen overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
      }}
    >
      <div className="flex h-full">
        <div className="w-1/2 bg-gray-200 items-center justify-center hidden md:flex">
          <img
            src={imageSrc}
            alt="User Login"
            className="w-full h-full object-cover"
          />
        </div>

        <motion.div
          className="relative w-full md:w-1/2 flex flex-col justify-center items-center p-10 text-white"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.5, delay: 0.2 } },
          }}
        >
          <div
            className="absolute inset-0 z-0"
            style={{ backgroundImage: `url(${LoginImage})` }}
          ></div>
          <motion.div
            className="relative z-10 w-full max-w-md"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, delay: 0.4 },
              },
            }}
          >
            <h1 className="text-3xl font-medium mb-8">{welcomeMessage}</h1>{" "}
            {children}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoginBody;
