import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  History,
  ShoppingBag,
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  CreditCard,
  Video,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Footer from "../../components/shared/Footer";
import { BookingsResponse } from "../../types/session.type";
import {
  SubscriptionsResponse,
} from "../../types/trainee.type";
import { getUserBookingshistory } from "../../services/session/BookingService";
import { BookingDetailsModal } from "../../components/modal/BookingDetailsModal ";
import { getUserSubscriptionhistory } from "../../services/subscription/subscriptionService";

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

type TabType = "sessions" | "purchases";

const UserHistoryPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("sessions");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const [isViewBookingModalOpen, setIsViewBookingModalOpen] = useState(false);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const recordsPerPage = 5;

  // Fetch session history
  const {
    data: sessionsData,
    isLoading: sessionsLoading,
    error: sessionsError,
  } = useQuery<BookingsResponse>({
    queryKey: ["userBookings", currentPage, recordsPerPage],
    queryFn: () =>
      getUserBookingshistory({
        page: currentPage,
        limit: recordsPerPage,
      }),
    enabled: activeTab === "sessions",
  });

  // Fetch purchase history
  const {
    data: purchasesData,
    isLoading: purchasesLoading,
    error: purchasesError,
  } = useQuery<SubscriptionsResponse>({
    queryKey: ["userSubscriptions", currentPage, recordsPerPage],
    queryFn: () =>
      getUserSubscriptionhistory({
        page: currentPage,
        limit: recordsPerPage,
      }),
    enabled: activeTab === "purchases",
  });

  const displayBookings = sessionsData?.bookings;
  const displaySubscriptions = purchasesData?.subscriptions;

  const totalPages =
    activeTab === "sessions"
      ? Math.ceil((sessionsData?.total ?? 0) / recordsPerPage)
      : Math.ceil((purchasesData?.total ?? 0) / recordsPerPage);

  const isLoading =
    activeTab === "sessions" ? sessionsLoading : purchasesLoading;
  const error = activeTab === "sessions" ? sessionsError : purchasesError;

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const viewBookingDetails = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setIsViewBookingModalOpen(true);
  };

  const handleCloseViewBookingModal = () => {
    setIsViewBookingModalOpen(false);
    setSelectedBookingId(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "active":
        return <CheckCircle className="text-green-600" size={20} />;
      case "confirmed":
        return <AlertCircle className="text-blue-600" size={20} />;
      case "canceled":
      case "expired":
        return <XCircle className="text-red-600" size={20} />;
      default:
        return <Clock className="text-gray-600" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "active":
        return "bg-green-100 text-green-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "canceled":
      case "expired":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
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
          className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        >
          <motion.div
            variants={fadeIn}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <History size={32} className="text-white" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              My History
            </h1>
          </motion.div>
          <motion.div
            variants={fadeIn}
            className="w-20 h-1 bg-white/30 mx-auto mb-6 rounded-full"
          ></motion.div>
          <motion.p
            variants={fadeIn}
            className="text-white/80 max-w-2xl mx-auto"
          >
            Track your fitness journey and subscription history
          </motion.p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden mb-16"
        >
          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => handleTabChange("sessions")}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 transition-colors duration-300 ${
                activeTab === "sessions"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Video size={20} />
              Session History
            </button>
            <button
              onClick={() => handleTabChange("purchases")}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 transition-colors duration-300 ${
                activeTab === "purchases"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <ShoppingBag size={20} />
              Purchase History
            </button>
          </div>

          <div className="p-8">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading {activeTab === 'sessions' ? 'sessions' : 'purchases'}...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-red-50 rounded-xl">
                <XCircle size={48} className="text-red-500 mx-auto mb-4" />
                <p className="text-red-600">Failed to load {activeTab === 'sessions' ? 'sessions' : 'purchases'}</p>
              </div>
            ) : (
            <>
              {/* Sessions Tab Content */}
              {activeTab === "sessions" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {displayBookings?.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <Video size={48} className="text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No session history found</p>
                    </div>
                  ) : (
                    displayBookings?.map((booking) => (
                      <motion.div
                        key={booking._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -2 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          viewBookingDetails(booking._id);
                        }}
                        className="p-6 bg-gray-50 rounded-xl border border-gray-200 transition-all duration-300 hover:cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-sm">
                              {booking.trainer.profilePicture ? (
                                <img
                                  src={booking.trainer.profilePicture}
                                  alt={booking.trainer.username}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                  <User className="text-white" size={20} />
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                Session with {booking.trainer.username}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                <div className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  <span>
                                    {new Date(
                                      booking.slotStart
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock size={14} />
                                  <span>
                                    {booking.slotDetails.startTime} -{" "}
                                    {booking.slotDetails.endTime}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {getStatusIcon(booking.status)}
                              {booking.status.charAt(0).toUpperCase() +
                                booking.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        {booking.notes && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-sm text-blue-800">
                              <strong>Notes:</strong> {booking.notes}
                            </p>
                          </div>
                        )}

                        <div className="mt-4 text-xs text-gray-500">
                          Booked on:{" "}
                          {new Date(booking.createdAt).toLocaleDateString()} at{" "}
                          {new Date(booking.createdAt).toLocaleTimeString()}
                        </div>
                      </motion.div>
                    ))
                  )}
                  {selectedBookingId && (
                    <BookingDetailsModal
                      bookingId={selectedBookingId}
                      isOpen={isViewBookingModalOpen}
                      onClose={handleCloseViewBookingModal}
                    />
                  )}
                </motion.div>
              )}

              {/* Purchases Tab Content */}
              {activeTab === "purchases" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {displaySubscriptions?.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <ShoppingBag
                        size={48}
                        className="text-gray-400 mx-auto mb-4"
                      />
                      <p className="text-gray-600">No purchase history found</p>
                    </div>
                  ) : (
                    displaySubscriptions?.map((subscription) => (
                      <motion.div
                        key={subscription._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -2 }}
                        className="p-6 bg-gray-50 rounded-xl border border-gray-200 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-white shadow-sm">
                              {subscription.trainerProfilePicture ? (
                                <img
                                  src={subscription.trainerProfilePicture}
                                  alt={subscription.trainerName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                  <CreditCard
                                    className="text-white"
                                    size={20}
                                  />
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {subscription.planDuration} Plan
                                {subscription.trainerName &&
                                  ` - ${subscription.trainerName}`}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                <div className="flex items-center gap-1">
                                  <Calendar size={14} />
                                  <span>
                                    {subscription.startDate
                                      ? new Date(
                                          subscription.startDate
                                        ).toLocaleDateString()
                                      : "N/A"}{" "}
                                    -{" "}
                                    {subscription.expiryDate
                                      ? new Date(
                                          subscription.expiryDate
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600 mb-2">
                              ₹{subscription.amount.toLocaleString()}
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(
                                subscription.status
                              )}`}
                            >
                              {getStatusIcon(subscription.status)}
                              {subscription.status.charAt(0).toUpperCase() +
                                subscription.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 bg-white rounded-lg">
                          <div className="text-center">
                            <p className="text-sm text-gray-500">
                              Plan Duration
                            </p>
                            <p className="font-semibold">
                              {subscription.planDuration}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Start Date</p>
                            <p className="font-semibold">
                              {subscription.startDate
                                ? new Date(
                                    subscription.startDate
                                  ).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Expiry Date</p>
                            <p className="font-semibold">
                              {subscription.expiryDate
                                ? new Date(
                                    subscription.expiryDate
                                  ).toLocaleDateString()
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  variants={fadeIn}
                  className="flex justify-center items-center gap-2 mt-8 p-4 flex-wrap"
                >
                  {/* Previous */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg disabled:bg-gray-400 hover:shadow-lg transition-all duration-300"
                  >
                    <ChevronLeft size={16} />
                    Prev
                  </motion.button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <motion.button
                        key={pageNum}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                          currentPage === pageNum
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {pageNum}
                      </motion.button>
                    )
                  )}

                  {/* Next */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg disabled:bg-gray-400 hover:shadow-lg transition-all duration-300"
                  >
                    Next
                    <ChevronRight size={16} />
                  </motion.button>
                </motion.div>
              )}
            </>
            )} 
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default UserHistoryPage;
