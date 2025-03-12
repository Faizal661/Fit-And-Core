import React, { useEffect } from 'react';
import { ToastType, useToast } from '../../context/ToastContext';
import '../../assets/styles/toast.css';
import icons from '../../assets/icons/ToastIcons'

interface ToastItemProps {
  id: string;
  type: ToastType;
  message: string;
  onClose: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ id, type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

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

const ToastContainer: React.FC = () => {
  const { toasts, hideToast } = useToast();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;