import React from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  isConfirming?: boolean;
  type?: "success" | "warning";
  showSpinner?: boolean | React.ReactNode;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  isConfirming = false,
  type = "success",
  showSpinner = true,
}) => {
  if (!isOpen) {
    return null;
  }

  const confirmButtonClasses =
    type === "success"
      ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
      : "bg-red-600 hover:bg-red-700 focus:ring-red-500";

  const spinner = (
    <div>
      <div className="w-4 h-4 border-y-2 border-l-3 rounded-full animate-spin mr-2"></div>
    </div>
  );

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[80] p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-800">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
                aria-label="Close"
                disabled={isConfirming}
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            {/* This div should conditionally render based on whether message is simple string or complex JSX */}
            {typeof message === "string" ? (
              <div className="bg-blue-50 rounded-lg p-4 mb-5">
                <p className="text-gray-700">{message}</p>
              </div>
            ) : (
              // If message is ReactNode, render it directly or wrap it if needed for consistent styling
              <div className="bg-blue-50 rounded-lg p-4 mb-5">{message}</div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                disabled={isConfirming}
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 text-white rounded-lg focus:outline-none focus:ring-2 disabled:opacity-70 transition-colors flex items-center justify-center min-w-24 ${confirmButtonClasses}`}
                disabled={isConfirming}
              >
                {isConfirming && showSpinner ? (
                  <>
                    {typeof showSpinner === "boolean" ? spinner : showSpinner}
                    {confirmText}...
                  </>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById("modal-root")!
  );
};

export default ConfirmModal;
