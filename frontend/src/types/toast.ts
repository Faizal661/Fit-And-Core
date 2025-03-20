
export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItemProps {
  id: string;
  type: ToastType;
  message: string;
  onClose: () => void;
}

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (type: ToastType, message: string, duration?: number) => void;
  hideToast: (id: string) => void;
}

