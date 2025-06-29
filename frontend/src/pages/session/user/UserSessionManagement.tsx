/* eslint-disable react-hooks/rules-of-hooks */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Clock,
  Calendar,
  ChevronRight,
  CalendarClock,
  X,
  CheckCircle,
  XCircle,
  ClipboardCheck,
} from "lucide-react";
import {
  getUserBookings,
  userCancelBooking,
} from "../../../services/session/BookingService";
import Footer from "../../../components/shared/Footer";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import { useToast } from "../../../context/ToastContext";
import { STATUS } from "../../../constants/messages/status.messages";
import PageNotFound from "../../../components/shared/error/PageNotFound";
import { REDIRECT_MESSAGES } from "../../../constants/messages/redirect.messages";
import { UserBooking } from "../../../types/session.type";
import { BookingModal } from "../../../components/modal/BookingModal ";
import { CancelBookingModal } from "../../../components/modal/CancelBookingModal";

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

const UserSessionManagementPage = () => {
  const today = new Date();
  const { trainerId } = useParams();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<UserBooking | null>(
    null
  );
  const [bookingIdToCancel, setBookingIdToCancel] = useState<string>("");

  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  if (!trainerId)
    return (
      <PageNotFound
        message={REDIRECT_MESSAGES.NO_TRAINER_FOUND}
        linkText={REDIRECT_MESSAGES.BACK}
        linkTo="/trainers"
      />
    );

  const {
    data: bookings = [],
    isLoading: isLoadingBookings,
    isError: isErrorBookings,
  } = useQuery({
    queryKey: ["userBookingsList", trainerId],
    queryFn: () => getUserBookings(trainerId),
  });

  const upcomingBookings = bookings.filter(
    (booking) =>
      booking.status === "confirmed" && new Date(booking.slotStart) > today
  );

  const otherBookings = bookings
    .filter(
      (booking) =>
        booking.status === "canceled" ||
        booking.status === "completed" ||
        (booking.status === "confirmed" && new Date(booking.slotStart) <= today)
    )
    .reverse();

  const displayBookings =
    activeTab === "upcoming" ? upcomingBookings : otherBookings;

  const cancelBookingMutation = useMutation({
    mutationFn: userCancelBooking,
    onSuccess: () => {
      setShowCancelModal(false);
      setBookingIdToCancel("");
      queryClient.invalidateQueries({
        queryKey: ["userBookingsList"],
      });
      showToast(STATUS.SUCCESS, "Booking cancelled successfully");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        showToast(STATUS.ERROR, error.response?.data.message);
      } else {
        showToast(STATUS.ERROR, "Failed to cancel booking");
      }
    },
  });

  const handleViewBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b._id === bookingId);
    if (booking) {
      setSelectedBooking(booking);
    }
  };

  const handleCancelClick = (bookingId: string) => {
    setBookingIdToCancel(bookingId);
    setShowCancelModal(true);
  };

  const closeModal = () => {
    setShowCancelModal(false);
    setSelectedBooking(null);
  };

  const handleCancelSubmit = (reason: string) => {
    if (!bookingIdToCancel) return;

    cancelBookingMutation.mutate({
      bookingId: bookingIdToCancel,
      reason,
    });
    setShowCancelModal(false);
    setBookingIdToCancel("");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 overflow-hidden">
      {/* Hero Section */}
      <div className="relative py-24 bg-gradient-to-r from-blue-600/90 to-purple-600/90">
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
            My Training Sessions
          </motion.h1>
          <motion.div
            variants={fadeIn}
            className="w-20 h-1 bg-white/30 mx-auto mb-6 rounded-full"
          ></motion.div>
          <motion.p
            variants={fadeIn}
            className="text-white/80 max-w-2xl mx-auto"
          >
            Manage your upcoming and past training sessions
          </motion.p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 mb-16"
        >
          {/* Tabs */}
          <div className="flex mb-8 overflow-hidden border border-gray-200 rounded-lg">
            <button
              className={`flex-1 py-3 px-4 font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
                activeTab === "upcoming"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("upcoming")}
            >
              <CalendarClock size={18} />
              Upcoming Sessions
            </button>
            <button
              className={`flex-1 py-3 px-4 font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
                activeTab === "other"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("other")}
            >
              <ClipboardCheck size={18} />
              Past & Cancelled
            </button>
          </div>

          {/* Sessions List */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold">
                {activeTab === "upcoming" ? "Upcoming" : "Past & Cancelled"}{" "}
                Sessions
              </h2>
            </div>

            {isLoadingBookings ? (
              <div className="py-8 text-center">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-600">
                  Loading{" "}
                  {activeTab === "upcoming" ? "upcoming" : "past & cancelled"}{" "}
                  bookings...
                </p>
              </div>
            ) : isErrorBookings ? (
              <div className="py-8 text-center text-red-600">
                <p>Error loading bookings.</p>
              </div>
            ) : displayBookings && displayBookings.length > 0 ? (
              <div className="space-y-4">
                {displayBookings.map((booking) => (
                  <motion.div
                    key={booking._id}
                    whileHover={{ y: -5 }}
                    className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shadow-inner overflow-hidden">
                        {booking.status === "completed" ? (
                          <CheckCircle className="text-green-600" size={24} />
                        ) : booking.status === "canceled" ? (
                          <XCircle className="text-red-600" size={24} />
                        ) : (
                          <Clock className="text-blue-600" size={24} />
                        )}
                      </div>

                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(booking.slotStart).toLocaleDateString([], {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                          ,
                        </p>
                        <p className="font-medium text-gray-900">
                          {booking.slotDetails.startTime} -{" "}
                          {booking.slotDetails.endTime}
                        </p>

                        <p
                          className={`text-sm mt-1 font-medium ${
                            booking.status === "confirmed"
                              ? "text-green-600"
                              : booking.status === "canceled"
                              ? "text-red-600"
                              : booking.status === "completed"
                              ? "text-blue-600"
                              : "text-gray-600"
                          }`}
                        >
                          Status: {booking.status}
                        </p>

                        {booking.notes && (
                          <div className="text-sm text-gray-500 italic mt-1">
                            {booking.status === "canceled" ? "" : "Feedback: "}
                            {booking.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {booking.status === "confirmed" && (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleCancelClick(booking._id)}
                          className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-red-200 to-red-100/50 text-red-600 rounded-md font-medium transition-all duration-300 text-sm hover:bg-red-200"
                        >
                          <X size={14} />
                          Cancel
                        </motion.button>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleViewBooking(booking._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md font-medium shadow-sm hover:shadow-md transition-all duration-300 opacity-90 group-hover:opacity-100 text-sm"
                      >
                        View Details
                        <ChevronRight
                          size={16}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-100">
                <p>
                  No{" "}
                  {activeTab === "upcoming" ? "upcoming" : "past or cancelled"}{" "}
                  bookings found.
                </p>
              </div>
            )}
          </div>

          {/* view detials of booking modal */}
          <BookingModal
            booking={selectedBooking}
            onClose={closeModal}
            currentUserType="trainee"
          />

          {/* cancel booking modal */}
          <CancelBookingModal
            isOpen={showCancelModal}
            onClose={() => setShowCancelModal(false)}
            onSubmit={handleCancelSubmit}
            isLoading={cancelBookingMutation.isPending}
          />
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default UserSessionManagementPage;
