import { motion } from "framer-motion";
import { useState } from "react";

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void> | void;
  isLoading?: boolean;
}

export const CancelBookingModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: CancelBookingModalProps) => {
  const [cancelReason, setCancelReason] = useState("");
  const [reasonError, setReasonError] = useState("");

  const handleSubmit = () => {
    if (!cancelReason.trim()) {
      setReasonError("Please provide a cancellation reason");
      return;
    }
    setReasonError("");
    onSubmit(cancelReason);
  };

  const handleCloseModal = () => {
    setReasonError("");
    setCancelReason("");
    onClose()
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
      >
        <h2 className="text-xl font-semibold mb-4">Cancel Booking</h2>
        <p className="mb-4 text-gray-600">
          Please provide a reason for cancellation:
        </p>
        <textarea
          value={cancelReason}
          onChange={(e) => {
            setCancelReason(e.target.value);
            if (reasonError) setReasonError("");
          }}
          className="w-full p-3 border border-gray-200 rounded-lg min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          placeholder="Enter cancellation reason..."
        />
        {reasonError && (
          <p className="text-red-600 text-sm mt-1">{reasonError}</p>
        )}
        <div className="mt-6 flex justify-end space-x-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCloseModal}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium text-gray-700 transition-all"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Submitting...</span>
              </div>
            ) : (
              "Confirm Cancel"
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
