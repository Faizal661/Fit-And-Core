import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  PlusCircle,
  Clock,
  Calendar,
  User,
  ChevronRight,
  CalendarClock,
  CalendarIcon,
  AlertCircle,
  X,
  Edit,
} from "lucide-react";
import {
  getTrainerBookings,
  getTrainerAvailabilities,
  trainerCancelBooking,
} from "../../../services/session/sessionService";
import Footer from "../../../components/shared/Footer";
import { useInView } from "react-intersection-observer";
import { IAvailability, UserBooking } from "../../../types/session.type";
import { useToast } from "../../../context/ToastContext";
import { STATUS } from "../../../constants/messages/status.messages";
import axios from "axios";
import { BookingModal } from "../../../components/shared/modal/BookingModal ";
import { CancelBookingModal } from "../../../components/shared/modal/CancelBookingModal";

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

const SessionManagementPage = () => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<UserBooking | null>(
    null
  );
  const [bookingIdToCancel, setBookingIdToCancel] = useState<string>("");

  const { showToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const {
    data: groupedAvailabilityData = [],
    isLoading: isLoadingAvailability,
  } = useQuery({
    queryKey: ["trainerAvailabilities"],
    queryFn: getTrainerAvailabilities,
  });

  const {
    data: bookings = [],
    isLoading: isLoadingBookings,
    isError: isErrorBookings,
  } = useQuery({
    queryKey: ["trainerUpcomingBookingsList"],
    queryFn: getTrainerBookings,
  });

  const cancelBookingMutation = useMutation({
    mutationFn: trainerCancelBooking,
    onSuccess: () => {
      setShowCancelModal(false);
      setBookingIdToCancel("");
      queryClient.invalidateQueries({
        queryKey: ["trainerUpcomingBookingsList"],
      });
      showToast(STATUS.SUCCESS, "Booking cancelled successfully");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        showToast(STATUS.ERROR, error.response?.data.message);
      } else {
        showToast(STATUS.ERROR, "failed to Cancel booking");
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

  const handleCancelSubmit = async (reason: string) => {
    if (!bookingIdToCancel) return;

    cancelBookingMutation.mutate({
      bookingId: bookingIdToCancel,
      reason,
    });
  };

  const handleAddAvailability = () => navigate("/trainer/availability-setup");

  const handleSlots = () => navigate("/trainer/slot-management");

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
            Session Management
          </motion.h1>
          <motion.div
            variants={fadeIn}
            className="w-20 h-1 bg-white/30 mx-auto mb-6 rounded-full"
          ></motion.div>
          <motion.p
            variants={fadeIn}
            className="text-white/80 max-w-2xl mx-auto"
          >
            Manage your training sessions and availability
          </motion.p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 mb-16 space-y-12"
        >
          {/* Upcoming Sessions */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold">Upcoming Sessions</h2>
            </div>

            {isLoadingBookings ? (
              <div className="py-8 text-center">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-600">Loading upcoming bookings...</p>
              </div>
            ) : isErrorBookings ? (
              <div className="py-8 text-center text-red-600">
                <p>Error loading bookings.</p>
              </div>
            ) : bookings && bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking: UserBooking) => (
                  <motion.div
                    key={booking._id}
                    whileHover={{ y: -5 }}
                    className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group transition-all duration-300" // Styling for each booking item
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shadow-inner overflow-hidden">
                        {booking.trainee?.profilePicture ? (
                          <img
                            src={booking.trainee.profilePicture}
                            alt={`${booking.trainee.username}'s profile`}
                            className="w-full h-full object-cover"
                          />
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
                          {" "}
                          {booking.slotDetails.startTime} -{" "}
                          {booking.slotDetails.endTime}
                        </p>
                        {booking.trainee?.username && (
                          <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                            <User size={14} className="text-gray-500" />{" "}
                            <span>{booking.trainee.username}</span>{" "}
                          </div>
                        )}

                        {booking.notes && (
                          <>
                            <p
                              className={`text-sm mt-1 ${
                                booking.status === "confirmed"
                                  ? "text-green-600"
                                  : booking.status === "canceled"
                                  ? "text-red-600"
                                  : "text-gray-600"
                              }`}
                            >
                              Status: {booking.status}
                            </p>
                            <div className="text-sm text-red-500 italic">
                              {booking.notes || "Not provided"}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {booking.status === "confirmed" ? (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleCancelClick(booking._id)}
                            className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-red-200 to-red-100/50 text-red-600 rounded-md font-medium transition-all duration-300 text-sm hover:bg-red-200"
                          >
                            <X size={14} />
                            Cancel
                          </motion.button>
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
                        </>
                      ) : booking.status === "canceled" ? (
                        <>
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
                        </>
                      ) : (
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
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p>No upcoming bookings found.</p>
              </div>
            )}
          </div>

          {/* view detials of booking modal */}
          <BookingModal
            booking={selectedBooking}
            onClose={closeModal}
            currentUserType="trainer"
          />
          
          {/* cancel booking modal */}
          <CancelBookingModal
            isOpen={showCancelModal}
            onClose={() => setShowCancelModal(false)}
            onSubmit={handleCancelSubmit}
            isLoading={cancelBookingMutation.isPending}
          />

          {/* Availability Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CalendarClock className="text-purple-600" size={24} />
                <h2 className="text-2xl font-bold">Your Availability</h2>
              </div>
              <div className="flex items-center justify between gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddAvailability}
                  className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
                >
                  <PlusCircle size={18} />
                  Add Availability
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSlots}
                  className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
                >
                  <Edit size={18} />
                  Edit Slots
                </motion.button>
              </div>
            </div>

            {isLoadingAvailability ? (
              <div className="py-6 text-center bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
                <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-600">Loading availability data...</p>
              </div>
            ) : groupedAvailabilityData &&
              Object.keys(groupedAvailabilityData).length > 0 ? (
              <div className="mb-6 space-y-4">
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
                  {Object.entries(groupedAvailabilityData)
                    .sort()
                    .map(([dateKey, availabilitiesForDate]) => {
                      const date = new Date(dateKey);

                      return (
                        <motion.div
                          key={dateKey}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            ease: [0.25, 0.1, 0.25, 1],
                          }}
                          className="border-b border-gray-100 last:border-b-0"
                        >
                          <div className="px-4 py-3 bg-gray-50/50 flex items-center">
                            <CalendarIcon
                              className="text-purple-600 mr-2"
                              size={18}
                            />
                            <h4 className="font-medium text-gray-800">
                              {date.toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                              })}
                            </h4>
                          </div>

                          <div className="px-4 py-2">
                            {availabilitiesForDate.map(
                              (availability: IAvailability) => (
                                <motion.div
                                  key={availability._id}
                                  whileHover={{ x: 2 }}
                                  className="flex items-center p-3 mb-2 last:mb-0 rounded-lg bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors"
                                >
                                  <div className="bg-blue-100 rounded-full p-2 mr-4">
                                    <Clock
                                      className="text-blue-600"
                                      size={18}
                                    />
                                  </div>
                                  <div className="flex-grow">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-800">
                                          {availability.startTime}
                                        </span>
                                        <span className="text-gray-400">→</span>
                                        <span className="font-medium text-gray-800">
                                          {availability.endTime}
                                        </span>
                                      </div>
                                      <div className="text-sm text-purple-600 font-medium">
                                        {availability.slotDuration} minutes per
                                        session
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                      <AlertCircle className="text-blue-600" size={22} />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-700 text-lg">
                        No Availability Found
                      </p>
                      <p className="text-blue-600 mt-1">
                        No upcoming availability was found .
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default SessionManagementPage;
