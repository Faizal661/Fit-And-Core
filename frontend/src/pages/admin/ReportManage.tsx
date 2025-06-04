import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { Report, ReportStatus } from "../../types/report.types";
import {
  getReports,
  updateReportStatus,
} from "../../services/session/reportService";
import { formatDateAndTime } from "../../utils/dateFormat";
import { useToast } from "../../context/ToastContext";
import { FeedbackModal } from "../../components/shared/modal/FeedbackModal";
import { BookingDetailsModal } from "../../components/shared/modal/BookingDetailsModal ";

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

const ReportManagementPage = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus | "all">(
    "pending"
  );
  const { showToast } = useToast();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [currentReportIdForModal, setCurrentReportIdForModal] = useState<
    string | null
  >(null);
  const [currentStatusForModal, setCurrentStatusForModal] =
    useState<ReportStatus | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const [isViewBookingModalOpen, setIsViewBookingModalOpen] = useState(false);

  const limit = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ["reports", currentPage, selectedStatus, limit],
    queryFn: () =>
      getReports({
        page: currentPage,
        limit: limit,
        status: selectedStatus,
      }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      reportId,
      status,
      resolutionDetails,
    }: {
      reportId: string;
      status: ReportStatus;
      resolutionDetails?: string;
    }) => {
      if (resolutionDetails) {
        return updateReportStatus(reportId, status, resolutionDetails);
      }
      return updateReportStatus(reportId, status);
    },
    onSuccess: () => {
      showToast("success", "Report status updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      setIsFeedbackModalOpen(false);
      setCurrentReportIdForModal(null);
      setCurrentStatusForModal(null);
    },
    onError: (error) => {
      showToast("error", "Failed to update report status.");
      console.error("Failed to update report status:", error);
    },
  });

  const handleStatusChange = (reportId: string, newStatus: ReportStatus) => {
    if (newStatus === "resolved" || newStatus === "rejected") {
      setCurrentReportIdForModal(reportId);
      setCurrentStatusForModal(newStatus);
      setIsFeedbackModalOpen(true);
    } else {
      updateStatusMutation.mutate({ reportId, status: newStatus });
    }
  };

 
  const handleFeedbackSubmit = (feedback: string) => {
    if (currentReportIdForModal && currentStatusForModal) {
      updateStatusMutation.mutate({
        reportId: currentReportIdForModal,
        status: currentStatusForModal,
        resolutionDetails: feedback,
      });
    }
  };
  const handleCloseFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
    setCurrentReportIdForModal(null);
    setCurrentStatusForModal(null);
  };

   const viewBookingDetails = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setIsViewBookingModalOpen(true);
  };
   const handleCloseViewBookingModal = () => {
    setIsViewBookingModalOpen(false);
    setSelectedBookingId(null);
  };


  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "in_review":
        return "bg-blue-100 text-blue-700";
      case "resolved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: ReportStatus) => {
    switch (status) {
      case "pending":
        return <Clock size={16} />;
      case "in_review":
        return <AlertCircle size={16} />;
      case "resolved":
        return <CheckCircle size={16} />;
      case "rejected":
        return <XCircle size={16} />;
      default:
        return null;
    }
  };

  const getAllowedNextStatuses = (
    currentStatus: ReportStatus
  ): ReportStatus[] => {
    switch (currentStatus) {
      case "pending":
        return ["in_review", "resolved", "rejected"];
      case "in_review":
        return ["resolved", "rejected"];
      case "resolved":
      case "rejected":
        return [];
      default:
        return [];
    }
  };

  const totalPages = Math.ceil((data?.totalReports || 0) / limit);

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
            <AlertTriangle size={32} className="text-white" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Report Management
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
            Review and manage user reports efficiently
          </motion.p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 mb-16"
        >
          {/* Status Filter */}
          <div className="flex flex-wrap gap-4 mb-8">
            {(
              ["pending", "in_review", "resolved", "rejected", "all"] as (
                | ReportStatus
                | "all"
              )[]
            ).map((status) => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedStatus === status
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status.charAt(0).toUpperCase() +
                  status.slice(1).replace("_", " ")}
              </motion.button>
            ))}
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading reports...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-red-50 rounded-xl">
              <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
              <p className="text-red-600">Failed to load reports</p>
            </div>
          ) : data?.reports?.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <AlertTriangle size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No reports found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {data?.reports.map((report: Report) => {
                const allowedNextStatuses = getAllowedNextStatuses(
                  report.status
                );

                return (
                  <motion.div
                    key={report._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-gray-50 rounded-xl border border-gray-200"
                  >
                    <div className="flex flex-col md:flex-row gap-6 justify-between">
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                            {report.reporterUserId.profilePicture ? (
                              <img
                                src={report.reporterUserId.profilePicture}
                                alt={report.reporterUserId.username}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <User className="text-gray-600" size={24} />
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">
                              Report from {report.reporterUserId.username} ({" "}
                              {report.reporterType})
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar size={14} />
                              <span>
                                {formatDateAndTime(new Date(report.createdAt))}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <MessageSquare
                            size={18}
                            className="text-gray-400 mt-1 flex-shrink-0"
                          />
                          <p className="text-gray-600">{report.message}</p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              Reported User:
                            </span>
                            <span>
                              {report.reportedUserId.profilePicture ? (
                                <img
                                  src={report.reportedUserId.profilePicture}
                                  alt={report.reportedUserId.username}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <User className="text-gray-600" size={24} />
                              )}
                            </span>
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                              {report.reportedUserId.username}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              Status:
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(
                                report.status
                              )}`}
                            >
                              {getStatusIcon(report.status)}
                              {report.status.charAt(0).toUpperCase() +
                                report.status.slice(1).replace("_", " ")}
                            </span>
                          </div>
                        </div>
                        {report.resolutionDetails && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              Resolution Details:
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(
                                report.status
                              )}`}
                            >
                              {report.resolutionDetails || "N/A"}
                            </span>
                          </div>
                        )}
                      </div>

                      {allowedNextStatuses.length > 0 && (
                        <div className="flex flex-col gap-2">
                          {allowedNextStatuses.map((status) => (
                            <motion.button
                              key={status}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                handleStatusChange(
                                  report._id,
                                  status as ReportStatus
                                )
                              }
                              disabled={updateStatusMutation.isPending}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                                status === "resolved"
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : status === "rejected"
                                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                                  : status === "in_review"
                                  ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                  : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                              }`}
                            >
                              {getStatusIcon(status as ReportStatus)}
                              <span>Mark as {status.replace("_", " ")}</span>
                            </motion.button>
                          ))}
                        </div>
                      )}

                      <div>
                        <motion.button
                          key={report.status}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => viewBookingDetails(report.bookingId)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                            report.status === "resolved"
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : report.status === "rejected"
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : report.status === "in_review"
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                              : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          }`}
                        >
                          <span> View More Details </span>
                          <ChevronDown size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </motion.button>

                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Next
                    <ChevronRight size={16} />
                  </motion.button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={handleCloseFeedbackModal}
        onSubmit={handleFeedbackSubmit}
        isSubmitting={updateStatusMutation.isPending}
        title={`Report Resolution Details`}
        description={`Please provide details for the report resolution . This will help us understand the context and ensure appropriate actions are taken.`}
        label="Resolution Details"
        placeholder="Enter resolution details here..."
        submitButtonText="Submit Resolution"
      />

       {selectedBookingId && (
        <BookingDetailsModal
          bookingId={selectedBookingId}
          isOpen={isViewBookingModalOpen}
          onClose={handleCloseViewBookingModal}
        />
      )}
    </div>
  );
};

export default ReportManagementPage;
