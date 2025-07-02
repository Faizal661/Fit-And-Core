import React, { useEffect } from "react";
import "../../../assets/styles/toast.css";
import icons from "../../../assets/icons/ToastIcons";
import { ToastItemProps } from "../../../types/toast.type";

export const ToastItem: React.FC<ToastItemProps> = ({
  type,
  message,
  duration,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  const animationDuration = `${duration / 1000}s`;

  return (
    <div className={`toast-item toast-${type}`}>
      <div className="toast-icon">{icons[type]}</div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={onClose}>
        {icons.close}
      </button>
      <div className="toast-timer-bar" style={{ animationDuration }}></div>
    </div>
  );
};
