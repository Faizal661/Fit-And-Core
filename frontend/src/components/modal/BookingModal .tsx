import { motion } from "framer-motion";
import { X, MessageSquare, Video, User, CheckCircle, Flag } from "lucide-react";
import { UserBooking, UpdateBookingData } from "../../types/session.type";
import { useState } from "react";
import { VideoCallModal } from "./VideoCallModal";
import { spinner } from "../shared/Spinner";
import ConfirmModal from "./ConfirmModal";
import { FeedbackModal } from "./FeedbackModal";
import { ReportModal } from "./ReportModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBookingStatus } from "../../services/session/BookingService";
import { useToast } from "../../context/ToastContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface BookingModalProps {
  booking: UserBooking | null;
  onClose: () => void;
  currentUserType: "trainer" | "trainee";
}

export const BookingModal = ({
  booking,
  onClose,
  currentUserType,
}: BookingModalProps) => {
  const [isStartingCall, setIsStartingCall] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const { showToast } = useToast();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Mutation for updating booking status
  const updateStatusMutation = useMutation({
    mutationFn: (data: UpdateBookingData) => updateBookingStatus(data),
    onSuccess: () => {
      showToast("success", "Booking status updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["trainerUpcomingBookingsList"],
      });
      setShowCompleteModal(false);
      setShowFeedbackModal(false);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        showToast(
          "error",
          error.response?.data.message || "Failed to update booking status"
        );
      } else {
        showToast(
          "error",
          "An unexpected error occurred while updating booking status"
        );
      }
    },
  });

  if (!booking) return null;

  const localUser =
    currentUserType === "trainer" ? booking?.trainer : booking?.trainee;
  const remoteUser =
    currentUserType === "trainer" ? booking?.trainee : booking?.trainer;

  const userId = localUser._id;
  const localProfilePicture = localUser.profilePicture;
  const remoteProfilePicture = remoteUser.profilePicture;

  const handleConfirmCall = async () => {
    setShowConfirmModal(false);
    setIsStartingCall(true);
    setShowVideoCall(true);
  };

  const handleCompleteBooking = () => {
    setShowCompleteModal(true);
  };

  const handleConfirmComplete = () => {
    setShowCompleteModal(false);
    setShowFeedbackModal(true);
  };

  const handleCompleteWithFeedback = (feedback: string) => {
    updateStatusMutation.mutate({
      bookingId: booking._id,
      status: "completed",
      feedback,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-blue-600";
      case "completed":
        return "text-green-600";
      case "canceled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} className="text-green-600" />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 h-dvh">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Booking Details
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowReportModal(true)}
                  className="text-gray-500 hover:text-red-600 transition-colors p-1"
                  title="Report an issue"
                >
                  <Flag size={18} />
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* User/Trainer Information Section */}
              <div className="space-y-4">
                <div
                  className={`p-3 rounded-lg ${
                    currentUserType === "trainee" ? "bg-blue-50" : "bg-gray-50"
                  }`}
                >
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    {currentUserType === "trainee"
                      ? "Your Trainer"
                      : "Your Trainee"}
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shadow-inner overflow-hidden">
                      {currentUserType === "trainee" ? (
                        booking.trainer?.profilePicture ? (
                          <img
                            src={booking.trainer.profilePicture}
                            alt={`${booking.trainer.username}'s profile`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="text-blue-600" size={20} />
                        )
                      ) : booking.trainee?.profilePicture ? (
                        <img
                          src={booking.trainee.profilePicture}
                          alt={`${booking.trainee.username}'s profile`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="text-blue-600" size={20} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {currentUserType === "trainee"
                          ? booking.trainer?.username || "Unknown Trainer"
                          : booking.trainee?.username || "Unknown Trainee"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {currentUserType === "trainee"
                          ? "Professional Trainer"
                          : "Trainee"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Session Details Section */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">
                      {new Date(booking.slotStart).toLocaleDateString([], {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">
                      {booking.slotDetails.startTime} -{" "}
                      {booking.slotDetails.endTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(booking.status)}
                      <p
                        className={`font-medium ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {booking.notes && (
                  <div>
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="font-medium text-gray-800 bg-gray-50 p-3 rounded-lg">
                      {booking.notes}
                    </p>
                  </div>
                )}

                {/* Feedback Section - Show if booking is completed and has feedback */}
                {booking.status === "completed" && booking.notes && (
                  <div>
                    <p className="text-sm text-gray-500">Trainer Feedback</p>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <p className="text-gray-800">{booking.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between mb-3">
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/messages`);
                  }}
                >
                  <MessageSquare size={16} />
                  Chat
                </motion.button>
                <button
                  onClick={() => setShowConfirmModal(true)}
                  disabled={isStartingCall || booking.status === "completed"}
                  className={`flex items-center gap-2 px-4 py-2 ${
                    isStartingCall || booking.status === "completed"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white rounded-lg transition-colors`}
                >
                  {isStartingCall ? spinner : <Video size={16} />}
                  {isStartingCall ? "Connecting..." : "Start Video Call"}
                </button>
              </div>

              {/* Complete Booking Button - Only for trainers */}
              {currentUserType === "trainer" &&
                booking.status === "confirmed" && (
                  <button
                    onClick={handleCompleteBooking}
                    disabled={updateStatusMutation.isPending}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
                  >
                    {updateStatusMutation.isPending ? (
                      spinner
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        Mark as Completed
                      </>
                    )}
                  </button>
                )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Video Call Confirmation Modal */}
      <ConfirmModal
        type="success"
        title="Start Video Call"
        message={`You are going to start a video call with the ${
          currentUserType === "trainer"
            ? `trainee - ${booking.trainee.username}`
            : `trainer ${booking.trainer.username}`
        }?`}
        confirmText="Start"
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmCall}
        isConfirming={isStartingCall}
      />

      {/* Completed session status update Confirmation Modal */}
      <ConfirmModal
        type="success"
        title="Complete Session"
        message="Are you sure you want to mark this session as completed?"
        confirmText="Complete"
        cancelText="Cancel"
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        onConfirm={handleConfirmComplete}
        isConfirming={false}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={handleCompleteWithFeedback}
        isSubmitting={updateStatusMutation.isPending}
        description="Please provide your feedback about the session."
        label="Feedback"
        placeholder="Share your thoughts about the session, areas of improvement, or positive feedback..."
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        bookingId={booking._id}
        reportedUserId={remoteUser._id}
        reporterType={currentUserType}
      />

      {/* Video Call Modal */}
      {showVideoCall && (
        <VideoCallModal
          bookingId={booking._id}
          userId={userId}
          userType={currentUserType}
          remoteProfilePicture={remoteProfilePicture}
          localProfilePicture={localProfilePicture}
          onClose={() => {
            setShowVideoCall(false);
            setIsStartingCall(false);
          }}
        />
      )}
    </>
  );
};
