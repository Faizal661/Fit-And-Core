import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  getTrainerSlotsByDate,
  cancelTrainerSlot,
} from "../../../services/session/sessionService";
import Footer from "../../../components/shared/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { SUCCESS_MESSAGES } from "../../../constants/messages/success.messages";
import { STATUS } from "../../../constants/messages/status.messages";
import { useToast } from "../../../context/ToastContext";
import axios from "axios";
import { ERR_MESSAGES } from "../../../constants/messages/error.messages";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { ISlot } from "../../../types/session.type";
import { formatDateForInput } from "../../../utils/dateFormat";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const SlotManagementPage = () => {
  const trainerId = useSelector(
    (state: RootState) => state.auth.user?.id || ""
  );
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const initialDate = new Date();
  initialDate.setDate(initialDate.getDate());
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [slotToCancelDetails, setSlotToCancelDetails] = useState<ISlot | null>(
    null
  );

  const getNextSevenDays = () => {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const nextSevenDays = getNextSevenDays();

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  // Query to fetch trainer's slots for the selected date
  const { data: slotsData, isLoading: isLoadingSlots } = useQuery({
    queryKey: ["trainerSlots", trainerId, formatDateForInput(selectedDate)],
    queryFn: () =>
      getTrainerSlotsByDate(trainerId, formatDateForInput(selectedDate)),
  });

  const cancelSlotMutation = useMutation({
    mutationFn: cancelTrainerSlot,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["trainerSlots", trainerId, formatDateForInput(selectedDate)],
      });
      showToast(STATUS.SUCCESS, SUCCESS_MESSAGES.SLOT_CANCELLED);
      setShowCancelModal(false);
      setSlotToCancelDetails(null);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        showToast(STATUS.ERROR, error.response?.data.message);
      } else {
        showToast(STATUS.ERROR, ERR_MESSAGES.SOMETHING_WENT_WRONG);
      }
      setShowCancelModal(false);
      setSlotToCancelDetails(null);
    },
  });

  const confirmCancellation = () => {
    if (slotToCancelDetails) {
      cancelSlotMutation.mutate({ slotId: slotToCancelDetails._id });
    }
  };
  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSlotToCancelDetails(null);
  };
  const requestCancellationConfirmation = (slot: ISlot) => {
    setSlotToCancelDetails(slot);
    setShowCancelModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 overflow-hidden">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-r from-blue-600/90 to-purple-600/90">
        <div
          className="absolute inset-0 bg-black/10 z-0 opacity-30"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        >
          <motion.h1
            variants={fadeIn}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Manage Slots
          </motion.h1>
          <motion.div
            variants={fadeIn}
            className="w-20 h-1 bg-white/30 mx-auto mb-6 rounded-full"
          ></motion.div>
          <motion.p
            variants={fadeIn}
            className="text-white/80 max-w-2xl mx-auto"
          >
            Manage your available slots based on dates
          </motion.p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 -mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 mb-16"
        >
          {/* Date Selection */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-lg font-semibold mb-4">
              <CalendarIcon className="text-blue-600" size={24} />
              Select Date
            </label>
            <div className="grid grid-cols-7 gap-2">
              {nextSevenDays.map((date) => (
                <motion.button
                  key={date.toISOString()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={`p-3 rounded-xl text-center transition-all duration-300 ${
                    isSelected(date)
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <div className="text-xs mb-1">
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div className="font-semibold">{date.getDate()}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Selected Date Information */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold flex items-center">
                <CalendarIcon className="text-purple-600 mr-2" size={20} />
                <span>
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </h3>
              <div className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                Selected Date
              </div>
            </div>

            {/* Available Slots */}
            {isLoadingSlots ? (
              <div className="py-6 text-center bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
                <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-600">Loading available slots...</p>
              </div>
            ) : !slotsData || slotsData.length === 0 ? (
              <div className="mb-6">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center">
                    <div className="bg-amber-100 p-2 rounded-full mr-4">
                      <AlertCircle className="text-amber-600" size={22} />
                    </div>
                    <div>
                      <p className="font-semibold text-amber-700 text-lg">
                        No Slots Available
                      </p>
                      <p className="text-amber-600 mt-1">
                        There are no available slots for this date. Please
                        select another date.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4 shadow-sm mb-6">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                      <CheckCircle className="text-blue-600" size={22} />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-700 text-lg">
                        Available Time Slots
                      </p>
                      <p className="text-blue-600 mt-1">
                        Select a time slot to book your session with the
                        trainer.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2  gap-4">
                  {slotsData.map((slot) => (
                    <motion.div
                      key={slot._id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-lg border transition-all ${
                        slot.status === "available"
                          ? "bg-white border-green-200 hover:border-green-300 hover:shadow-md"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex items-center mb-3">
                          <div
                            className={`p-2 rounded-full mr-3 ${
                              slot.status === "available"
                                ? "bg-green-100"
                                : "bg-gray-100"
                            }`}
                          >
                            <Clock
                              className={`${
                                slot.status === "available"
                                  ? "text-green-600"
                                  : "text-gray-500"
                              }`}
                              size={18}
                            />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">
                                {slot.startTime}
                              </span>
                              <span className="text-gray-400">→</span>
                              <span className="font-medium">
                                {slot.endTime}
                              </span>
                            </div>
                            <div
                              className={`text-sm mt-1 ${
                                slot.status === "available"
                                  ? "text-green-600"
                                  : "text-gray-500"
                              }`}
                            >
                              {slot.status === "available"
                                ? "Available for booking"
                                : slot.status === "canceled"
                                ? "canceled"
                                : "Already booked"}
                            </div>
                          </div>
                        </div>

                        <div className="mt-auto pt-2">
                          {slot.status === "available" ? (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                requestCancellationConfirmation(slot)
                              }
                              disabled={cancelSlotMutation.isPending}
                              className="w-full px-4 py-2 bg-gradient-to-r from-red-400/90 to-red-600/90 rounded-lg text-white font-medium shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {cancelSlotMutation.isPending &&
                              slotToCancelDetails?._id === slot._id ? (
                                <div className="flex items-center justify-center space-x-2">
                                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                  <span>Cancelling...</span>
                                </div>
                              ) : (
                                "Cancel Now"
                              )}
                            </motion.button>
                          ) : (
                            <div className="w-full px-4 py-2 bg-gray-200 rounded-lg text-gray-500 font-medium flex items-center justify-center space-x-1">
                              <X size={14} />
                              <span>
                                {slot.status === "canceled"
                                  ? "Canceled"
                                  : "Unavailable"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showCancelModal && slotToCancelDetails && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4"
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
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-gray-800">
                  Confirm Cancellation
                </h2>
                <button
                  onClick={closeCancelModal}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
                  aria-label="Close"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>

              <div className="bg-red-50 rounded-lg p-4 mb-5">
                <p className="text-gray-700">
                  You are about to cancel the slot from{" "}
                  <span className="font-semibold text-red-700">
                    {slotToCancelDetails.startTime}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-red-700">
                    {slotToCancelDetails.endTime}
                  </span>
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeCancelModal}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
                  disabled={cancelSlotMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmCancellation}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-70 transition-colors flex items-center justify-center min-w-28" // Red button for cancellation
                  disabled={cancelSlotMutation.isPending}
                >
                  {cancelSlotMutation.isPending ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Cancelling...
                    </>
                  ) : (
                    "Confirm Cancellation"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default SlotManagementPage;
