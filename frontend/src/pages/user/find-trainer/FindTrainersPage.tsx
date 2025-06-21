import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Trainer } from "../../../types/trainer.type";
import Footer from "../../../components/shared/Footer";
import { getApprovedTrainers } from "../../../services/trainer/trainerService";
import { motion } from "framer-motion";
import { Search, Users, Medal, Clock, ChevronRight } from "lucide-react";

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

const FindTrainersPage = () => {
  const navigate = useNavigate();
  const [specialization, setSpecialization] = useState("");

  const {
    data: trainers = [],
    isLoading,
    error,
  } = useQuery<Trainer[]>({
    queryKey: ["approvedTrainers", specialization],
    queryFn: () => getApprovedTrainers({ specialization }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Query will automatically refetch due to queryKey dependency on specialization
  };

  const handleViewDetails = (trainerId: string) => {
    navigate(`/trainer/${trainerId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 overflow-hidden">
      {/* Hero Section */}
      <div className="relative py-24 bg-gradient-to-r from-blue-600/90 to-purple-600/90">
        <div className="absolute inset-0 bg-black/10 z-0 opacity-30"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        >
          <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find Your Perfect Trainer
          </motion.h1>
          <motion.div variants={fadeIn} className="w-20 h-1 bg-white/30 mx-auto mb-6 rounded-full"></motion.div>
          <motion.p variants={fadeIn} className="text-white/80 max-w-2xl mx-auto">
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
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="Search by specialization (e.g., Yoga, HIIT, Strength Training)"
                className="w-full px-6 py-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </form>

          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
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
              <p className="text-red-600">Error loading trainers. Please try again later.</p>
            </motion.div>
          ) : trainers.length === 0 ? (
            <motion.div
              variants={fadeIn}
              className="text-center py-16 bg-gray-50 rounded-xl"
            >
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No trainers found matching your search.</p>
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
                  variants={fadeIn}
                  whileHover={{ y: -5 }}
                  onClick={() => handleViewDetails(trainer._id)}
                  className="p-6 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer transition-all duration-300 group"
                >
                  <div className="flex gap-4">
                    <img
                      src={trainer.profilePicture || "/api/placeholder/80/80"}
                      alt={`${trainer.username}'s profile`}
                      className="w-20 h-20 rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{trainer.username}</h3>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {trainer.specialization}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Medal size={16} className="text-amber-500" />
                          <span>Expert Trainer</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} className="text-emerald-500" />
                          <span>{trainer.yearsOfExperience}</span>
                        </div>
                      </div>
                    </div>
                    
                    <ChevronRight size={20} className="text-gray-400 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default FindTrainersPage;