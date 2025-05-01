import { useToast } from '../../../context/ToastContext';
import '../../../assets/styles/toast.css';
import { ToastItem } from './ToastItem';



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
          duration={toast.duration}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;