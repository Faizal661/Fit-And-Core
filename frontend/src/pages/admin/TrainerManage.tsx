import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTrainers,
  approveTrainer,
  rejectTrainer,
} from "../../services/admin/trainerManagement";
import { Trainer } from "../../types/trainer.type";
import { z } from "zod";
const rejectReasonSchema = z
  .string()
  .min(10, "Reason must be at least 10 characters")
  .max(500, "Reason cannot exceed 500 characters");

const TrainerManage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [viewMode, setViewMode] = useState<"details" | null>(null);
  const [activeTab, setActiveTab] = useState<
    "pending" | "approved" | "rejected"
  >("pending");
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
    trainers?.filter((trainer) => trainer.status === "pending") || [];
  const approvedTrainers =
    trainers?.filter((trainer) => trainer.status === "approved") || [];
  const rejectedTrainers =
    trainers?.filter((trainer) => trainer.status === "rejected") || [];

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-gray-700">
          Loading trainer data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-red-600">
          Error loading trainer data
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-400 ">
      <h1 className="text-2xl font-bold text-gray-800 pl-20 px-6 py-4">
        Trainer Management
      </h1>
      <div className="border-b-1 pt-2 mb-5"></div>

      <div className="flex mb-6 bg-white  shadow overflow-hidden m-6">
        <button
          className={`px-6 py-3 font-medium text-sm flex-1 ${
            activeTab === "pending"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Pending Requests ({pendingTrainers.length})
        </button>
        <button
          className={`px-6 py-3 font-medium text-sm flex-1 ${
            activeTab === "approved"
              ? "bg-green-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("approved")}
        >
          Approved Trainers ({approvedTrainers.length})
        </button>
        <button
          className={`px-6 py-3 font-medium text-sm flex-1 ${
            activeTab === "rejected"
              ? "bg-red-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setActiveTab("rejected")}
        >
          Rejected Applications ({rejectedTrainers.length})
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white shadow p-6 mb-6 m-6">
        {activeTab === "pending" && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Pending Trainer Requests
            </h2>
            {pendingTrainers.length === 0 ? (
              <div className="text-center text-lg text-gray-500 py-8">
                No pending requests at this moment
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Name</th>
                      <th className="py-3 px-6 text-left">Email</th>
                      <th className="py-3 px-6 text-left">Phone</th>
                      <th className="py-3 px-6 text-left">Specialization</th>
                      <th className="py-3 px-6 text-left">Experience</th>
                      <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                    {pendingTrainers.map((trainer) => (
                      <tr
                        key={trainer._id}
                        className="border-b border-gray-200 hover:bg-gray-50"
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
                              className="px-2 py-1 rounded text-blue-600 hover:text-blue-900 mx-1 bg-blue-100"
                            >
                              View Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === "approved" && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Approved Trainers
            </h2>
            {approvedTrainers.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No approved trainers yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Name</th>
                      <th className="py-3 px-6 text-left">Email</th>
                      <th className="py-3 px-6 text-left">Phone</th>
                      <th className="py-3 px-6 text-left">Specialization</th>
                      <th className="py-3 px-6 text-left">Experience</th>
                      <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                    {approvedTrainers.map((trainer) => (
                      <tr
                        key={trainer._id}
                        className="border-b border-gray-200 hover:bg-gray-50"
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
                              className="px-2 py-1 rounded text-blue-600 hover:text-blue-900 mx-1 bg-blue-100"
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === "rejected" && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Rejected Applications
            </h2>
            {rejectedTrainers.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No rejected applications
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Name</th>
                      <th className="py-3 px-6 text-left">Email</th>
                      <th className="py-3 px-6 text-left">Phone</th>
                      <th className="py-3 px-6 text-left">Specialization</th>
                      <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                    {rejectedTrainers.map((trainer) => (
                      <tr
                        key={trainer._id}
                        className="border-b border-gray-200 hover:bg-gray-50"
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
                              className="px-2 py-1 rounded text-blue-600 hover:text-blue-900 mx-1 bg-blue-100"
                            >
                              Details
                            </button>
                            {/* <button
                              onClick={() => handleApprove(trainer._id)}
                              className="text-green-600 hover:text-green-900 mx-1"
                            >
                              Reconsider
                            </button> */}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Trainer Details Modal */}
      {selectedTrainer && viewMode === "details" && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 bg-blue-600 text-white">
              <h2 className="text-xl font-semibold">Trainer Details</h2>
              <button
                onClick={closeModal}
                className="text-white text-2xl hover:text-gray-200 hover:cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {selectedTrainer.status === "rejected" &&
                selectedTrainer.reason && (
                  <div className="pb-10 max-h-[70vh] overflow-y-auto">
                      <h3 className="text-lg font-semibold text-red-700 mb-2">
                        Rejection Reason
                      </h3>
                      <p className="text-red-400">{selectedTrainer.reason}</p>
                  </div>
                )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
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
                      {new Date(selectedTrainer.createdAt).toLocaleDateString()}
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
                        selectedTrainer.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedTrainer.status === "approved"
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
                <p className="text-gray-700">{selectedTrainer.about}</p>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Document Proofs
                </h3>
                <div className="px-4 py-1 max-h-[70vh] overflow-y-auto">
                  <div className="mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedTrainer.documentProofs.map((doc, index) => (
                        <div
                          key={index}
                          className="border rounded-lg overflow-hidden group relative"
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
                              className="px-4 py-2 bg-blue-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              View Full
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Achievements
                </h3>
                <div className="px-4 py-1 max-h-[70vh] overflow-y-auto">
                  <div className="mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedTrainer.achievements.map((doc, index) => (
                        <div
                          key={index}
                          className="border rounded-lg overflow-hidden group relative"
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
                              className="px-4 py-2 bg-blue-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              View Full
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Certifications
                </h3>
                <div className="px-4 py-1 max-h-[70vh] overflow-y-auto">
                  <div className="mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedTrainer.certifications.map((doc, index) => (
                        <div
                          key={index}
                          className="border rounded-lg overflow-hidden group relative"
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
                              className="px-4 py-2 bg-blue-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              View Full
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {selectedTrainer.status === "pending" && (
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    onClick={handleReject}
                    className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 hover:cursor-pointer"
                    disabled={rejectMutation.isPending}
                  >
                    {rejectMutation.isPending ? "Rejecting..." : "Reject"}
                  </button>
                  <button
                    onClick={() => handleApprove(selectedTrainer._id)}
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 hover:cursor-pointer"
                    disabled={approveMutation.isPending}
                  >
                    {approveMutation.isPending ? "Approving..." : "Approve"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
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

      {currentImageUrl && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setCurrentImageUrl(null)}
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white w-8 h-8 rounded-full flex items-center justify-center"
            >
              ✕
            </button>
            <img
              src={currentImageUrl}
              alt="Document"
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerManage;
