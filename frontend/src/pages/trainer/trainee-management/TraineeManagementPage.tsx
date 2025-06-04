import { useState, FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTrainees } from "../../../services/trainer/traineeManageService";
import Footer from "../../../components/shared/Footer";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { PaginatedTraineesResult, TraineeData } from "../../../types/trainee.type";
import { formatDate } from "../../../utils/dateFormat";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};


const TraineeManagementPage = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState<number>(1);
  const [recordsPerPage, setRecordsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTrainee, setSelectedTrainee] =
    useState<TraineeData | null>(null);

  // Fetch trainees data
  const { data, isLoading, error } = useQuery<PaginatedTraineesResult, Error>({
    queryKey: ["trainees", activePage, recordsPerPage, searchTerm],
    queryFn: () =>
      fetchTrainees({
        page: activePage,
        limit: recordsPerPage,
        search: searchTerm,
      }),
    staleTime: 5000,
  });

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActivePage(1);
  };

  const openDetailsModal = (trainee: TraineeData) =>
    setSelectedTrainee(trainee);
  const closeModal = () => setSelectedTrainee(null);

  const navigateToFullProfile = (traineeId: string) => {
    navigate(`/trainer/trainees/${traineeId}`);
  };

  const totalPages = data ? Math.ceil(data.total / recordsPerPage) : 1;

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Format subscription status with visual indicators
  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      expired: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-gray-100 text-gray-800",
    };

    const defaultColor = "bg-blue-100 text-blue-800";
    const lowerStatus = status.toLowerCase();
    return statusColors[lowerStatus] || defaultColor;
  };


  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Background pattern overlay */}
      <div
        className="absolute inset-0 bg-black/10 z-0 opacity-30"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      ></div>

      {/* Main content container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:px-8">
        <motion.div
          className="mb-8 flex items-center"
          variants={fadeIn}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-4xl font-bold text-white">Trainee Management</h1>
          {/* <div className="ml-4 h-1 w-12 bg-purple-300 rounded-full"></div> */}
        </motion.div>

        {/* Search and filter controls */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <motion.div
            variants={fadeIn}
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-5"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Search Trainees
            </h2>
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by username or email..."
                className="flex-grow px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search
              </button>
            </form>
          </motion.div>

          <motion.div
            variants={fadeIn}
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-5"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              Display Options
            </h2>
            <div className="flex items-center justify-between">
              <div className="text-gray-700">
                {data ? (
                  <span>
                    Showing {(activePage - 1) * recordsPerPage + 1} -{" "}
                    {Math.min(activePage * recordsPerPage, data.total)} of{" "}
                    {data.total} trainees
                  </span>
                ) : (
                  <span>Loading records...</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-gray-700">Per page:</label>
                <select
                  value={recordsPerPage}
                  onChange={(e) => {
                    setRecordsPerPage(Number(e.target.value));
                    setActivePage(1);
                  }}
                  className="bg-white border border-gray-300 text-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Trainees data table */}
        <motion.div
          variants={fadeIn}
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden mb-8"
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <motion.div
                className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              ></motion.div>
              <p className="mt-4 text-gray-600 font-medium">
                Loading trainees...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="mt-4 text-xl font-bold text-gray-800">
                Error Loading Data
              </h3>
              <p className="mt-2 text-gray-600">{error.message}</p>
            </div>
          ) : !data || data.trainees.length === 0 ? (
            <div className="text-center py-16">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="mt-4 text-xl font-bold text-gray-800">
                No Trainees Found
              </h3>
              <p className="mt-2 text-gray-600">
                Try adjusting your search criteria
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    <th className="py-3.5 px-6 text-left">#</th>
                    <th className="py-3.5 px-6 text-left">Trainee</th>
                    <th className="py-3.5 px-6 text-left">Email</th>
                    <th className="py-3.5 px-6 text-center">Subscription</th>
                    <th className="py-3.5 px-6 text-center">Status</th>
                    <th className="py-3.5 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.trainees.map((trainee: TraineeData, index: number) => {
                    // Get most recent subscription if available
                    const latestSubscription =
                      trainee.subscriptionHistory &&
                      trainee.subscriptionHistory.length > 0
                        ? trainee.subscriptionHistory[0]
                        : null;

                    return (
                      <motion.tr
                        key={trainee.traineeId}
                        className="hover:bg-gray-50 transition-colors duration-150"
                        variants={fadeIn}
                        transition={{ delay: 0.05 * index }}
                        whileHover={{
                          backgroundColor: "rgba(243, 244, 246, 1)",
                        }}
                      >
                        <td className="py-4 px-6 text-sm text-gray-500">
                          {(activePage - 1) * recordsPerPage + index + 1}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                                src={
                                  trainee.profilePicture ||
                                  "/api/placeholder/100/100"
                                }
                                alt={trainee.username}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">
                                {trainee.username}
                              </div>
                              <div className="text-xs text-gray-500">
                                Member since {formatDate(trainee.createdAt)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500">
                          {trainee.email}
                        </td>
                        <td className="py-4 px-6 text-sm text-center">
                          {latestSubscription ? (
                            <div className="inline-flex flex-col items-center">
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                                  latestSubscription.status
                                )}`}
                              >
                                {latestSubscription.status}
                              </span>
                              <span className="text-xs text-gray-500 mt-1">
                                {latestSubscription.planDuration}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">
                              No subscription
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              trainee.isBlocked
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            <span
                              className={`mr-1.5 h-2 w-2 rounded-full ${
                                trainee.isBlocked
                                  ? "bg-red-600"
                                  : "bg-green-600"
                              }`}
                            ></span>
                            {trainee.isBlocked ? "Blocked" : "Active"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => openDetailsModal(trainee)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            View
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination controls */}
          {data && data.total > recordsPerPage && (
            <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setActivePage((prev) => Math.max(prev - 1, 1))}
                  disabled={activePage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setActivePage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={activePage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(activePage - 1) * recordsPerPage + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(activePage * recordsPerPage, data.total)}
                    </span>{" "}
                    of <span className="font-medium">{data.total}</span> results
                  </p>
                </div>
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() =>
                        setActivePage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={activePage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {/* Page numbers */}
                    {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = idx + 1;
                      } else if (activePage <= 3) {
                        pageNum = idx + 1;
                        if (idx === 4) pageNum = totalPages;
                      } else if (activePage >= totalPages - 2) {
                        pageNum = totalPages - 4 + idx;
                      } else {
                        pageNum = activePage - 2 + idx;
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => setActivePage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            activePage === pageNum
                              ? "z-10 bg-purple-600 border-purple-600 text-white"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() =>
                        setActivePage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={activePage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Trainee Details Modal */}
        {selectedTrainee && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-xl">
                <h2 className="text-2xl font-bold flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0012 11z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Trainee Quick View
                </h2>
                <button
                  onClick={closeModal}
                  className="text-purple-200 hover:text-white focus:outline-none text-3xl transition-colors"
                  aria-label="Close modal"
                >
                  &times;
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto styled-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Profile Picture and Basic Info */}
                  <div className="lg:col-span-1 space-y-6">
                    <div className="flex flex-col items-center">
                      <img
                        src={
                          selectedTrainee.profilePicture ||
                          "/api/placeholder/150/150"
                        } // Fallback placeholder
                        alt={selectedTrainee.username}
                        className="w-32 h-32 rounded-4xl object-cover ring-4 ring-purple-300 shadow-lg mb-3"
                      />
                      <h3 className="text-xl font-semibold ">
                        {selectedTrainee.username}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {selectedTrainee.email}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-3 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-purple-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Account Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        {/* <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">ID:</span>
                          <span
                            className="text-gray-800 truncate"
                            title={selectedTrainee._id}
                          >
                            {selectedTrainee._id}
                          </span>
                        </div> */}
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">
                            Status:
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              selectedTrainee.isBlocked
                                ? "bg-red-100 text-red-800 ring-1 ring-red-300"
                                : "bg-green-100 text-green-800 ring-1 ring-green-300"
                            }`}
                          >
                            {selectedTrainee.isBlocked ? "Blocked" : "Active"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">
                            Joined:
                          </span>
                          <span className="text-gray-800">
                            {formatDate(new Date(selectedTrainee.createdAt))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Subscription History */}
                  <div className="lg:col-span-2">
                    <h4 className="text-lg font-semibold  mb-3 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-purple-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Subscription History
                    </h4>
                    {selectedTrainee.subscriptionHistory &&
                    selectedTrainee.subscriptionHistory.length > 0 ? (
                      <ul className="space-y-3 max-h-[45vh] overflow-y-auto pr-2 styled-scrollbar-thin">
                        {selectedTrainee.subscriptionHistory.map((sub) => (
                          <li
                            key={sub._id}
                            className="bg-purple-50/80 backdrop-blur-sm rounded-lg p-4 shadow-md border border-purple-200 hover:shadow-lg transition-shadow"
                          >
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                              <div>
                                <span className="font-semibold ">
                                  Plan:
                                </span>
                                <span className="ml-1 text-gray-700">
                                  {sub.planDuration}
                                </span>
                              </div>
                              <div>
                                <span className="font-semibold ">
                                  Amount:
                                </span>
                                <span className="ml-1 text-gray-700">
                                  ₹ {sub.amount.toFixed(2)}
                                </span>
                              </div>
                              <div>
                                <span className="font-semibold ">
                                  Status:
                                </span>
                                <span
                                  className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                                    sub.status || "unknown"
                                  )}`}
                                >
                                  {sub.status || "N/A"}
                                </span>
                              </div>
                              <div>
                              </div>
                              <div>
                                <span className="font-semibold">
                                  Starts:
                                </span>
                                <span className="ml-1 text-gray-700">
                                  {formatDate(new Date(sub.startDate))}
                                </span>
                              </div>
                              {sub.expiryDate && (
                                <div>
                                  <span className="font-semibold">
                                    Expires:
                                  </span>
                                  <span className="ml-1 text-gray-700">
                                    {formatDate(new Date(sub.expiryDate))}
                                  </span>
                                </div>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-8">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 mx-auto text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p className="mt-3 text-gray-500">
                          No subscription history available.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer with Actions */}
              <div className="mt-6 px-6 py-4 bg-gray-100/70 backdrop-blur-sm rounded-b-xl flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={closeModal}
                  className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 shadow-sm hover:shadow-md"
                >
                  Back
                </button>
                <button
                  onClick={() => navigateToFullProfile(selectedTrainee.traineeId)}
                  className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center justify-center shadow-sm hover:shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                  View Full Profile
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
      <Footer />
    </motion.div>
  );
};

export default TraineeManagementPage;
