import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Footer from "../../../components/shared/footer";
import { getApprovedTrainers } from "../../../services/trainer/trainerService";
import { motion } from "framer-motion";
import { Search, Users, Clock, ChevronRight, Star, X, ChevronDown } from "lucide-react";
import { GetApprovedTrainersResponse } from "../../../types/trainer.type";
import useDebounce from "../../../hooks/useDebounce";
import { specializations } from "../../../constants/specializations";

// Animation variants
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

const MAX_RECORDS_PER_PAGE = 5;

const FindTrainersPage = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState<number>(1);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [trainerNameSearchTerm, setTrainerNameSearchTerm] =
    useState<string>("");
  const debouncedTrainerNameSearchTerm = useDebounce(
    trainerNameSearchTerm,
    600
  );

  const [recordsPerPage] = useState<number>(MAX_RECORDS_PER_PAGE);

  const {
    data: trainersData,
    isLoading,
    error,
  } = useQuery<GetApprovedTrainersResponse>({
    queryKey: [
      "approvedTrainers",
      selectedSpecialization,
      activePage,
      recordsPerPage,
      debouncedTrainerNameSearchTerm,
    ],
    queryFn: () =>
      getApprovedTrainers({
        specialization: selectedSpecialization,
        page: activePage,
        limit: recordsPerPage,
        searchTerm: debouncedTrainerNameSearchTerm,
      }),
  });

  const trainers = trainersData?.trainers || [];
  const totalCount = trainersData?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / recordsPerPage);

  const handleSpecializationChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedSpecialization(e.target.value);
    setActivePage(1);
  };

  const handleTrainerNameSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTrainerNameSearchTerm(e.target.value);
    setActivePage(1);
  };

  const handleViewDetails = (trainerId: string) => {
    navigate(`/trainer/${trainerId}`);
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
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        >
          <motion.h1
            variants={fadeIn}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Find Your Perfect Trainer
          </motion.h1>
          <motion.div
            variants={fadeIn}
            className="w-20 h-1 bg-white/30 mx-auto mb-6 rounded-full"
          ></motion.div>
          <motion.p
            variants={fadeIn}
            className="text-white/80 max-w-2xl mx-auto"
          >
            Discover expert trainers who can help you achieve your fitness goals
          </motion.p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="relative">
              <label htmlFor="specialization-filter" className="sr-only">
                Filter by Specialization
              </label>
              <select
                id="specialization-filter"
                value={selectedSpecialization}
                onChange={handleSpecializationChange}
                className="w-full px-6 py-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 appearance-none bg-no-repeat bg-right-center"
              >
                <option value="">All Specializations</option>
                {specializations.slice(1).map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              {/* Clear Button */}
              {selectedSpecialization ? ( 
                <button
                  type="button"
                  onClick={() => setSelectedSpecialization("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full transition-colors duration-200"
                  aria-label="Clear specialization filter"
                >
                  <X size={18} />
                </button>
              ) : (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <ChevronDown size={20} />
                </div>
              )}
            </div>

            {/* Trainer Name Search Input */}
            <div className="relative">
              <input
                type="text"
                value={trainerNameSearchTerm}
                onChange={handleTrainerNameSearchChange}
                placeholder="Search trainer by name..."
                className="w-full px-6 py-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <Search
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </div>

          {/* trainers listing section */}
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(recordsPerPage)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 bg-gray-200 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <motion.div
              variants={fadeIn}
              className="text-center py-8 bg-red-50 rounded-xl border border-red-100"
            >
              <p className="text-red-600">
                Error loading trainers. Please try again later.
              </p>
            </motion.div>
          ) : trainers.length === 0 ? (
            <motion.div
              variants={fadeIn}
              className="text-center py-16 bg-gray-50 rounded-xl"
            >
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                No trainers found matching your search.
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {trainers.map((trainer) => (
                <motion.div
                  key={trainer._id}
                  whileHover={{ y: -5 }}
                  onClick={() => handleViewDetails(trainer._id)}
                  className="p-6 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer transition-all duration-300 group"
                >
                  <div className="flex gap-4">
                    <img
                      src={trainer.profilePicture}
                      alt={`${trainer.username}'s profile`}
                      className="w-20 h-20 rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {trainer.username}
                        </h3>
                        {/* Display Specialization as a pill */}
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {trainer.specialization}
                        </span>
                      </div>

                      {/* Display Rating Information */}
                      <div className="flex items-center gap-2 mb-2 text-sm text-gray-700">
                        {trainer.rating && trainer.rating.totalReviews > 0 ? (
                          <>
                            <Star
                              size={16}
                              className="text-yellow-400 fill-current"
                            />
                            <span className="font-semibold">
                              {trainer.rating.averageRating.toFixed(1)}
                            </span>
                            <span className="text-gray-500">
                              ({trainer.rating.totalReviews} reviews)
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-500">No ratings yet</span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock size={16} className="text-emerald-500" />
                          <span>{trainer.yearsOfExperience}</span>{" "}
                        </div>
                      </div>
                    </div>

                    <ChevronRight
                      size={20}
                      className="text-gray-400 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {trainers && totalCount > recordsPerPage && (
            <motion.div
              variants={fadeIn}
              className="flex justify-center items-center gap-2 mt-16 flex-wrap"
            >
              {/* Previous */}
              <button
                onClick={() => setActivePage((prev) => Math.max(prev - 1, 1))}
                disabled={activePage === 1}
                className="px-2 py-1 bg-purple-500 text-white rounded disabled:bg-gray-400 hover:bg-purple-700"
              >
                Prev
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setActivePage(pageNum)}
                    className={`px-2 py-1 rounded 
                              ${
                                activePage === pageNum
                                  ? "bg-purple-500 text-white"
                                  : "bg-gray-200 text-gray-700 hover:bg-purple-700 hover:text-white"
                              }`}
                  >
                    {pageNum}
                  </button>
                )
              )}

              {/* Next */}
              <button
                onClick={() =>
                  setActivePage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={activePage === totalPages}
                className="px-2 py-1 bg-purple-500 text-white rounded disabled:bg-gray-400 hover:bg-purple-700"
              >
                Next
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default FindTrainersPage;
