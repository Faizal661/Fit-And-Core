import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTrainers,
  approveTrainer,
  rejectTrainer,
} from "../../services/admin/trainerManagement";
import { Trainer } from "../../types/trainer.type";
import { z } from "zod";
import Footer from "../../components/shared/footer";
import { rejectReasonSchema } from "../../schemas/trainerSchema";
import { STATUS } from "../../constants/messages/status.messages";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import ImageViewModal from "../../components/modal/ImageViewModal";

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const TrainerManage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [viewMode, setViewMode] = useState<"details" | null>(null);
  const [activeTab, setActiveTab] = useState<
    STATUS.PENDING | STATUS.APPROVED | STATUS.REJECTED
  >(STATUS.PENDING);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [reasonError, setReasonError] = useState<string | null>(null);

  const {
    data: trainers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["trainers"],
    queryFn: fetchTrainers,
  });

  const pendingTrainers =
    trainers?.filter((trainer) => trainer.status === STATUS.PENDING) || [];
  const approvedTrainers =
    trainers?.filter((trainer) => trainer.status === STATUS.APPROVED) || [];
  const rejectedTrainers =
    trainers?.filter((trainer) => trainer.status === STATUS.REJECTED) || [];

  const approveMutation = useMutation({
    mutationFn: approveTrainer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainers"] });
      setSelectedTrainer(null);
      setViewMode(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectTrainer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainers"] });
      setSelectedTrainer(null);
      setViewMode(null);
      setShowRejectModal(false);
      setRejectReason("");
      setReasonError(null);
    },
  });

  const handleSelectTrainer = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setViewMode("details");
  };

  const handleApprove = (trainerId: string) => {
    approveMutation.mutate(trainerId);
  };

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const handleRejectSubmit = () => {
    try {
      rejectReasonSchema.parse(rejectReason);
      setReasonError(null);
      if (selectedTrainer) {
        rejectMutation.mutate({
          trainerId: selectedTrainer._id,
          reason: rejectReason,
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setReasonError(error.errors[0].message);
      }
    }
  };

  const closeModal = () => {
    setSelectedTrainer(null);
    setViewMode(null);
    setCurrentImageUrl(null);
    setShowRejectModal(false);
    setRejectReason("");
    setReasonError(null);
  };

  const handleViewImage = (url: string) => {
    setCurrentImageUrl(url);
  };

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  if (isLoading) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-600"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="text-2xl font-semibold text-white">
          Loading trainer data...
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-600"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="text-2xl font-semibold text-white">
          Error loading trainer data
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div
        className="absolute inset-0 bg-black/10 z-0 opacity-30"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      ></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:px-8">
        <motion.h1
          className="text-3xl font-bold text-white mb-6 ps-4"
          variants={fadeIn}
          transition={{ delay: 0.1 }}
        >
          Trainer Management
        </motion.h1>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="flex justify-between mb-6 bg-white rounded-lg shadow-md p-4"
        >
          <div className="flex w-full space-x-1">
            <motion.button
              className={`px-6 py-3 font-medium text-sm flex-1 rounded-md transition-all duration-200 ${
                activeTab === STATUS.PENDING
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab(STATUS.PENDING)}
              variants={fadeIn}
            >
              Pending Requests ({pendingTrainers.length})
            </motion.button>
            <motion.button
              className={`px-6 py-3 font-medium text-sm flex-1 rounded-md transition-all duration-200 ${
                activeTab === STATUS.APPROVED
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab(STATUS.APPROVED)}
              variants={fadeIn}
              transition={{ delay: 0.1 }}
            >
              Approved Trainers ({approvedTrainers.length})
            </motion.button>
            <motion.button
              className={`px-6 py-3 font-medium text-sm flex-1 rounded-md transition-all duration-200 ${
                activeTab === STATUS.REJECTED
                  ? "bg-purple-600 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab(STATUS.REJECTED)}
              variants={fadeIn}
              transition={{ delay: 0.2 }}
            >
              Rejected Applications ({rejectedTrainers.length})
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          variants={fadeIn}
          className="bg-white shadow rounded-lg overflow-x-auto"
        >
          {activeTab === STATUS.PENDING && (
            <>
              <h2 className="text-xl font-semibold text-gray-800 p-6">
                Pending Trainer Requests
              </h2>
              {pendingTrainers.length === 0 ? (
                <div className="text-center text-lg text-gray-500 py-8">
                  No pending requests at this moment
                </div>
              ) : (
                <table className="min-w-full bg-white mb-10">
                  <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <tr>
                      <th className="py-3 px-6 text-left">Name</th>
                      <th className="py-3 px-6 text-left">Email</th>
                      <th className="py-3 px-6 text-left">Phone</th>
                      <th className="py-3 px-6 text-left">Specialization</th>
                      <th className="py-3 px-6 text-left">Experience</th>
                      <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                    {pendingTrainers.map((trainer, index) => (
                      <motion.tr
                        key={trainer._id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                        variants={fadeIn}
                        transition={{ delay: 0.1 + index * 0.02 }}
                      >
                        <td className="py-3 px-6 text-left whitespace-nowrap font-medium">
                          {trainer.username}
                        </td>
                        <td className="py-3 px-6 text-left">{trainer.email}</td>
                        <td className="py-3 px-6 text-left">{trainer.phone}</td>
                        <td className="py-3 px-6 text-left">
                          {trainer.specialization}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {trainer.yearsOfExperience}
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex item-center justify-center">
                            <button
                              onClick={() => handleSelectTrainer(trainer)}
                              className="bg-blue-500 text-white hover:bg-blue-600 rounded-md px-3 py-1 text-xs font-semibold mx-1"
                            >
                              View Details
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {activeTab === STATUS.APPROVED && (
            <>
              <h2 className="text-xl font-semibold text-gray-800 p-6">
                Approved Trainers
              </h2>
              {approvedTrainers.length === 0 ? (
                <div className="text-center text-lg text-gray-500 py-8">
                  No approved trainers yet
                </div>
              ) : (
                <table className="min-w-full bg-white mb-10">
                  <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <tr>
                      <th className="py-3 px-6 text-left">Name</th>
                      <th className="py-3 px-6 text-left">Email</th>
                      <th className="py-3 px-6 text-left">Phone</th>
                      <th className="py-3 px-6 text-left">Specialization</th>
                      <th className="py-3 px-6 text-left">Experience</th>
                      <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                    {approvedTrainers.map((trainer, index) => (
                      <motion.tr
                        key={trainer._id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                        variants={fadeIn}
                        transition={{ delay: 0.1 + index * 0.02 }}
                      >
                        <td className="py-3 px-6 text-left whitespace-nowrap font-medium">
                          {trainer.username}
                        </td>
                        <td className="py-3 px-6 text-left">{trainer.email}</td>
                        <td className="py-3 px-6 text-left">{trainer.phone}</td>
                        <td className="py-3 px-6 text-left">
                          {trainer.specialization}
                        </td>
                        <td className="py-3 px-6 text-left">
                          {trainer.yearsOfExperience}
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex item-center justify-center">
                            <button
                              onClick={() => handleSelectTrainer(trainer)}
                              className="bg-blue-500 text-white hover:bg-blue-600 rounded-md px-3 py-1 text-xs font-semibold mx-1"
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {activeTab === STATUS.REJECTED && (
            <>
              <h2 className="text-xl font-semibold text-gray-800 p-6">
                Rejected Applications
              </h2>
              {rejectedTrainers.length === 0 ? (
                <div className="text-center text-lg text-gray-500 py-8">
                  No rejected applications
                </div>
              ) : (
                <table className="min-w-full bg-white mb-10">
                  <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <tr>
                      <th className="py-3 px-6 text-left">Name</th>
                      <th className="py-3 px-6 text-left">Email</th>
                      <th className="py-3 px-6 text-left">Phone</th>
                      <th className="py-3 px-6 text-left">Specialization</th>
                      <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                    {rejectedTrainers.map((trainer, index) => (
                      <motion.tr
                        key={trainer._id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                        variants={fadeIn}
                        transition={{ delay: 0.1 + index * 0.02 }}
                      >
                        <td className="py-3 px-6 text-left whitespace-nowrap font-medium">
                          {trainer.username}
                        </td>
                        <td className="py-3 px-6 text-left">{trainer.email}</td>
                        <td className="py-3 px-6 text-left">{trainer.phone}</td>
                        <td className="py-3 px-6 text-left">
                          {trainer.specialization}
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex item-center justify-center">
                            <button
                              onClick={() => handleSelectTrainer(trainer)}
                              className="bg-blue-500 text-white hover:bg-blue-600 rounded-md px-3 py-1 text-xs font-semibold mx-1"
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </motion.div>

        {/* Trainer Details Modal */}
        {selectedTrainer && viewMode === "details" && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg w-full max-w-3xl overflow-hidden shadow-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex justify-between items-center px-6 py-4 bg-purple-600 text-white">
                <h2 className="text-xl font-semibold">Trainer Details</h2>
                <button
                  onClick={closeModal}
                  className="text-white hover:cursor-pointer focus:outline-none "
                >
                  ✕
                </button>
              </div>
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {selectedTrainer.status === STATUS.REJECTED &&
                  selectedTrainer.reason && (
                    <div className="pb-6 max-h-[70vh] overflow-y-auto">
                      <h3 className="text-lg font-semibold text-red-700 mb-2">
                        Rejection Reason
                      </h3>
                      <p className="text-red-600 bg-red-50 p-3 rounded-md">
                        {selectedTrainer.reason}
                      </p>
                    </div>
                  )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="pl-4 pb-5">
                      {selectedTrainer.profilePicture && (
                        <img
                          src={selectedTrainer.profilePicture}
                          alt={selectedTrainer.username}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Personal Information
                    </h3>
                    <div className="mb-3">
                      <span className="text-gray-600 font-medium">Name:</span>
                      <span className="ml-2">{selectedTrainer.username}</span>
                    </div>
                    <div className="mb-3">
                      <span className="text-gray-600 font-medium">Email:</span>
                      <span className="ml-2">{selectedTrainer.email}</span>
                    </div>
                    <div className="mb-3">
                      <span className="text-gray-600 font-medium">Phone:</span>
                      <span className="ml-2">{selectedTrainer.phone}</span>
                    </div>
                    <div className="mb-3">
                      <span className="text-gray-600 font-medium">
                        Application Date:
                      </span>
                      <span className="ml-2">
                        {new Date(
                          selectedTrainer.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Professional Information
                    </h3>
                    <div className="mb-3">
                      <span className="text-gray-600 font-medium">
                        Specialization:
                      </span>
                      <span className="ml-2">
                        {selectedTrainer.specialization}
                      </span>
                    </div>
                    <div className="mb-3">
                      <span className="text-gray-600 font-medium">
                        Experience:
                      </span>
                      <span className="ml-2">
                        {selectedTrainer.yearsOfExperience}
                      </span>
                    </div>
                    <div className="mb-3">
                      <span className="text-gray-600 font-medium">Status:</span>
                      <span
                        className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                          selectedTrainer.status === STATUS.PENDING
                            ? "bg-yellow-100 text-yellow-800"
                            : selectedTrainer.status === STATUS.APPROVED
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedTrainer.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    About
                  </h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                    {selectedTrainer.about}
                  </p>
                </div>

                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Document Proofs
                  </h3>
                  <div className="px-4 py-1 max-h-[70vh] overflow-y-auto">
                    <div className="mb-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedTrainer.documentProofs.map((doc, index) => (
                          <motion.div
                            key={index}
                            className="border rounded-lg overflow-hidden group relative shadow-sm hover:shadow-md transition-all"
                            whileHover={{ scale: 1.03 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 10,
                            }}
                          >
                            <img
                              src={doc}
                              alt={`Document ${index + 1}`}
                              className="w-full h-48 object-cover cursor-pointer"
                              onClick={() => handleViewImage(doc)}
                            />
                            <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all">
                              <button
                                onClick={() => handleViewImage(doc)}
                                className="px-4 py-2 bg-purple-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                View Full
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Achievements
                  </h3>
                  <div className="px-4 py-1 max-h-[70vh] overflow-y-auto">
                    <div className="mb-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedTrainer.achievements.map((doc, index) => (
                          <motion.div
                            key={index}
                            className="border rounded-lg overflow-hidden group relative shadow-sm hover:shadow-md transition-all"
                            whileHover={{ scale: 1.03 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 10,
                            }}
                          >
                            <img
                              src={doc}
                              alt={`Achievement ${index + 1}`}
                              className="w-full h-48 object-cover cursor-pointer"
                              onClick={() => handleViewImage(doc)}
                            />
                            <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all">
                              <button
                                onClick={() => handleViewImage(doc)}
                                className="px-4 py-2 bg-purple-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                View Full
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Certifications
                  </h3>
                  <div className="px-4 py-1 max-h-[70vh] overflow-y-auto">
                    <div className="mb-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedTrainer.certifications.map((doc, index) => (
                          <motion.div
                            key={index}
                            className="border rounded-lg overflow-hidden group relative shadow-sm hover:shadow-md transition-all"
                            whileHover={{ scale: 1.03 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 10,
                            }}
                          >
                            <img
                              src={doc}
                              alt={`Certification ${index + 1}`}
                              className="w-full h-48 object-cover cursor-pointer"
                              onClick={() => handleViewImage(doc)}
                            />
                            <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all">
                              <button
                                onClick={() => handleViewImage(doc)}
                                className="px-4 py-2 bg-purple-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                View Full
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {selectedTrainer.status === STATUS.PENDING && (
                  <motion.div
                    className="mt-8 flex justify-end space-x-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <button
                      onClick={handleReject}
                      className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                      disabled={rejectMutation.isPending}
                    >
                      {rejectMutation.isPending ? "Rejecting..." : "Reject"}
                    </button>
                    <button
                      onClick={() => handleApprove(selectedTrainer._id)}
                      className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                      disabled={approveMutation.isPending}
                    >
                      {approveMutation.isPending ? "Approving..." : "Approve"}
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Rejection Reason Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">
                Reject Trainer Application
              </h2>
              <p className="mb-4">Please provide a reason for rejection:</p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2 border rounded-md min-h-[100px]"
                placeholder="Enter rejection reason..."
              />
              {reasonError && (
                <p className="text-red-600 text-sm mt-1">{reasonError}</p>
              )}
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={closeModal}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectSubmit}
                  className=" px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  disabled={rejectMutation.isPending}
                >
                  {rejectMutation.isPending ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}

        <ImageViewModal
          imageUrl={currentImageUrl}
          onClose={() => setCurrentImageUrl(null)}
        />
      </div>
      <Footer />
    </motion.div>
  );
};

export default TrainerManage;
