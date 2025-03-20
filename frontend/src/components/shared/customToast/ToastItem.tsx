import React, { useEffect } from 'react';
import '../../../assets/styles/toast.css';
import icons from '../../../assets/icons/ToastIcons'
import { ToastItemProps } from '../../../types/toast';

export const ToastItem: React.FC<ToastItemProps> = ({ id, type, message, onClose }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        onClose();
      }, 7000);
  
      return () => {
        clearTimeout(timer);
      };
    }, [onClose]);
  
    return (
      <div className={`toast-item toast-${type}`}>
        <div className="toast-icon">{icons[type]}</div>
        <div className="toast-message">{message}</div>
        <button className="toast-close" onClick={onClose}>
          {icons.close}
        </button>
      </div>
    );
  };