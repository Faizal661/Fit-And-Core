import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface GlowLinkProps {
    to: string;
    children: ReactNode;
    className?: string;
    primary?: boolean;
  }

export const GlowLink: React.FC<GlowLinkProps> = ({
    to,
    children,
    className,
    primary = false,
  }) => {
    const baseClass = primary
      ? "relative overflow-hidden group px-10 py-4 bg-gradient-to-br from-blue-500 to-emerald-500 text-white rounded-md text-lg font-medium shadow-xl transition-all duration-300 hover:shadow-blue-500/30 hover:shadow-2xl"
      : "relative overflow-hidden group px-10 py-4 bg-white text-gray-800 rounded-md text-lg font-medium shadow-xl transition-all duration-300 hover:shadow-2xl";
  
    return (
      <Link to={to} className={`${baseClass} ${className}`}>
        <span className="relative z-10">{children}</span>
        <span className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 rounded-md"></span>
      </Link>
    );
  };
  