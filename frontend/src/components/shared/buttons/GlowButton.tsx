import React, { ReactNode, MouseEventHandler } from "react";
import { motion } from "framer-motion";

interface GlowButtonProps {
  type?: "button" | "submit" | "reset" | undefined;
  className?: string;
  children: ReactNode;
  primary?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  type,
  className,
  children,
  onClick,
  primary = false,
  disabled = false,
}) => {
  const baseClass = primary
    ? "relative overflow-hidden group px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md text-lg font-medium shadow-xl transition-all duration-300 hover:shadow-blue-500/30 hover:shadow-2xl"
    : "relative overflow-hidden group px-10 py-4 bg-white text-gray-800  text-lg font-medium transition-all duration-300 hover:shadow-xl";

  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${className} ${disabledClass}`}
    >
      <span className="relative z-10">{children}</span>
      {!disabled && (
        <span className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 rounded-md"></span>
      )}
    </motion.button>
  );
};
