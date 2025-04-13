import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "../../../config/axios.config";
import { useNavigate } from "react-router-dom";
import { Trainer } from "../../../types/trainer.type";
import { Skeleton } from "@mui/material";
import Footer from "../../../components/shared/Footer";

const FindTrainersPage = () => {
  const navigate = useNavigate();
  const [specialization, setSpecialization] = useState("");

  const {
    data: trainers = [],
    isLoading,
    // error,
  } = useQuery<Trainer[]>({
    queryKey: ["approvedTrainers", specialization],
    queryFn: async () => {
      const response = await axios.get("/trainer/trainer-approved", {
        params: { specialization },
      });
      return response.data.approvedTrainers;
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Query will automatically refetch due to queryKey dependency on specialization
  };

  const handleViewDetails = (trainerId: string) => {
    navigate(`/trainer/${trainerId}`);
  };

  return (
    <div>
      <div className="min-h-screen bg-white p-8 pt-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-12">
            <h1 className="text-xl text-gray-800 mb-6 md:mb-0">Find trainers</h1>
            <form onSubmit={handleSearch} className="mb-6 md:mb-0 flex border border-gray-200">
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="Search by specialization"
                className="px-4 py-2 w-full md:w-auto focus:outline-none text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 border-l border-gray-200 text-gray-600 hover:bg-gray-50 text-sm transition-colors"
              >
                Search
              </button>
            </form>
          </div>
  
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton height={120} animation="wave" />
              <Skeleton height={120} animation="wave" />
              <Skeleton height={120} animation="wave" />
            </div>
          ) : (
            <div>
              {trainers.length === 0 ? (
                <p className="text-gray-500 text-sm">No trainers found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trainers?.map((trainer, index) => (
                  <div
                    key={trainer._id}
                    onClick={() => handleViewDetails(trainer._id)}
                    className="border border-gray-300 p-6 cursor-pointer hover:border-gray-200 transition-colors flex items-start gap-4"
                  >
                    <div className="flex-shrink-0">
                      <img 
                        src={trainer.profilePicture || "/api/placeholder/80/80"} 
                        alt={`${trainer.username}'s profile`}
                        className="w-16 h-16 rounded-full object-cover border-1 border-slate-200"
                      />
                    </div>
                    <div>
                      <h2 className="text-base mb-3">
                        <span className="text-gray-400 mr-2">{index + 1}.</span>
                        {trainer.username}
                      </h2>
                      <p className="text-sm text-gray-500 mb-2">
                        {trainer.specialization}
                      </p>
                      <p className="text-xs text-gray-400">
                        {trainer.yearsOfExperience} experience
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FindTrainersPage;
