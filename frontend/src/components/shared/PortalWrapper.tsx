import React, { useEffect } from "react";
import ReactDOM from "react-dom";

interface PortalWrapperProps {
  children: React.ReactNode;
  onClose: () => void;
}

const PortalWrapper: React.FC<PortalWrapperProps> = ({ children, onClose }) => {

  const portalRoot = document.getElementById("portal-root");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return portalRoot
    ? ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-transparent ">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-500"
            >
              ✖
            </button>
            {children}
          </div>
        </div>,
        portalRoot
      )
    : null;
};

export default PortalWrapper;
