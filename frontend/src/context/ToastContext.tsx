import React, { createContext, useContext, useState, ReactNode } from "react";
import { ToastContextType, ToastMessage, ToastType } from "../types/toast.type";
import { WARNING_MESSAGES } from "../constants/warning.messages";

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (type: ToastType, message: string, duration = 3300) => {
    const id = Date.now().toString();
    const newToast = { id, type, message, duration };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    if (duration !== Infinity) {
      setTimeout(() => {
        hideToast(id);
      }, duration);
    }
  };

  const hideToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error(WARNING_MESSAGES.USETOAST_WARNING);
  }
  return context;
};
