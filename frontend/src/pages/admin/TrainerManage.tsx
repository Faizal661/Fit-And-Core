import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTrainers,
  approveTrainer,
  rejectTrainer,
} from "../../services/admin/trainerManagement";
import { Trainer } from "../../types/trainer";



const TrainerManage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [viewMode, setViewMode] = useState<"details" | "documents" | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  const { data: trainers, isLoading, error } = useQuery({
    queryKey: ["trainers"],
    queryFn: fetchTrainers,
  });

  const pendingTrainers = trainers?.filter(
    (trainer) => trainer.status === "pending"
  ) || [];
  const approvedTrainers = trainers?.filter(
    (trainer) => trainer.status === "approved"
  ) || [];
  const rejectedTrainers = trainers?.filter(
    (trainer) => trainer.status === "rejected"
  ) || [];

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
    },
  });

  const handleSelectTrainer = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setViewMode("details");
  };

  const handleApprove = (trainerId: string) => {
    approveMutation.mutate(trainerId);
  };

  const handleReject = (trainerId: string) => {
    rejectMutation.mutate(trainerId);
  };

  const handleViewDocuments = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setViewMode("documents");
  };

  const handleViewImage = (url: string) => {
    setCurrentImageUrl(url);
  };

  const closeModal = () => {
    setSelectedTrainer(null);
    setViewMode(null);
    setCurrentImageUrl(null);
  };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="text-2xl font-semibold text-gray-700">
//           Loading trainer data...
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="text-2xl font-semibold text-red-600">
//           Error loading trainer data
//         </div>
//       </div>
//     );
//   }

  return (
    <div className="min-h-screen bg-gray-400 ">
      <h1 className="text-2xl font-bold text-gray-800 pl-20 px-6 py-4">
        Trainer Management
      </h1>
      <div className="border-b-1 pt-2 mb-5"></div>

      {/* Tabs */}
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
                No pending requests at the moment
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
                          {trainer.yearsOfExperience} years
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex item-center justify-center">
                            <button
                              onClick={() => handleSelectTrainer(trainer)}
                              className="text-blue-600 hover:text-blue-900 mx-1"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => handleViewDocuments(trainer)}
                              className="text-purple-600 hover:text-purple-900 mx-1"
                            >
                              Documents
                            </button>
                            <button
                              onClick={() => handleApprove(trainer._id)}
                              className="text-green-600 hover:text-green-900 mx-1"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(trainer._id)}
                              className="text-red-600 hover:text-red-900 mx-1"
                            >
                              Reject
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
                          {trainer.yearsOfExperience} years
                        </td>
                        <td className="py-3 px-6 text-center">
                          <div className="flex item-center justify-center">
                            <button
                              onClick={() => handleSelectTrainer(trainer)}
                              className="text-blue-600 hover:text-blue-900 mx-1"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => handleViewDocuments(trainer)}
                              className="text-purple-600 hover:text-purple-900 mx-1"
                            >
                              Documents
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
                              className="text-blue-600 hover:text-blue-900 mx-1"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => handleApprove(trainer._id)}
                              className="text-green-600 hover:text-green-900 mx-1"
                            >
                              Reconsider
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
      </div>

      {/* Trainer Details Modal */}
      {selectedTrainer && viewMode === "details" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 bg-blue-600 text-white">
              <h2 className="text-xl font-semibold">Trainer Details</h2>
              <button
                onClick={closeModal}
                className="text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
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
                      {selectedTrainer.yearsOfExperience} years
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
                  Achievements
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {selectedTrainer.achievements.map((achievement, index) => (
                    <li key={index} className="text-gray-700">
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Certifications
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {selectedTrainer.certifications.map((certification, index) => (
                    <li key={index} className="text-gray-700">
                      {certification}
                    </li>
                  ))}
                </ul>
              </div>

              {selectedTrainer.status === "pending" && (
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    onClick={() => handleReject(selectedTrainer._id)}
                    className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    disabled={rejectMutation.isPending}
                  >
                    {rejectMutation.isPending ? "Rejecting..." : "Reject"}
                  </button>
                  <button
                    onClick={() => handleApprove(selectedTrainer._id)}
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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

      {/* Documents Modal */}
      {selectedTrainer && viewMode === "documents" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 bg-purple-600 text-white">
              <h2 className="text-xl font-semibold">
                Documents - {selectedTrainer.username}
              </h2>
              <button
                onClick={closeModal}
                className="text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Document Proofs
                </h3>
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
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all">
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

              {selectedTrainer.status === "pending" && (
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    onClick={() => handleReject(selectedTrainer._id)}
                    className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    disabled={rejectMutation.isPending}
                  >
                    {rejectMutation.isPending ? "Rejecting..." : "Reject"}
                  </button>
                  <button
                    onClick={() => handleApprove(selectedTrainer._id)}
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
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

      {/* Full Image Modal */}
      {currentImageUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
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