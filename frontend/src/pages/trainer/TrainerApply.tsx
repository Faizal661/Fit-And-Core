import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, Phone, Award, Clock, FileText, X, Check, ChevronLeft } from "lucide-react";

import {
  TrainerApplyFormData,
  trainerApplySchema,
} from "../../schemas/trainerSchema";
import { useToast } from "../../context/ToastContext";
import { submitTrainerApplication } from "../../services/trainer/trainerService";
import { checkTrainerApplicationStatus } from "../../services/trainer/trainerService";
import Footer from "../../components/shared/footer";
import { ApplicationStatus } from "../../types/trainer.type";
import { STATUS } from "../../constants/messages/status.messages";
import { INFO_MESSAGES } from "../../constants/messages/info.messages";
import { SUCCESS_MESSAGES } from "../../constants/messages/success.messages";
import { WARNING_MESSAGES } from "../../constants/messages/warning.messages";
import { ERR_MESSAGES } from "../../constants/messages/error.messages";
import Loader from "../../components/shared/Loader";

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

const TrainerApply = () => {
  const navigate = useNavigate();
  const processedRef = useRef(false);
  const { showToast } = useToast();
  const [documentProofs, setDocumentProofs] = useState<File[]>([]);
  const [certifications, setCertifications] = useState<File[]>([]);
  const [achievements, setAchievements] = useState<File[]>([]);

  const { data: applicationStatus, isLoading } = useQuery<ApplicationStatus, Error>({
    queryKey: ["trainerApplicationStatus"],
    queryFn: checkTrainerApplicationStatus,
  });

  useEffect(() => {
    if (processedRef.current) return;

    if (applicationStatus) {
      processedRef.current = true;
      if (applicationStatus.status === STATUS.PENDING) {
        showToast(STATUS.INFO, INFO_MESSAGES.TRAINER_APPLICATION_UNDER_REVIEW);
      } else if (applicationStatus.status === STATUS.APPROVED) {
        showToast(STATUS.SUCCESS, SUCCESS_MESSAGES.TRAINER_APPLICATION_APPROVED, 10000);
        navigate("/");
      } else if (applicationStatus.status === STATUS.REJECTED) {
        showToast(STATUS.WARNING, WARNING_MESSAGES.TRAINER_APPLICATION_REJECTED);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationStatus]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TrainerApplyFormData>({
    resolver: zodResolver(trainerApplySchema),
    defaultValues: {
      phone: "",
      specialization: "",
      yearsOfExperience: "",
      about: "",
    },
  });

  const handleDocumentProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && documentProofs.length + files.length <= 3) {
      setDocumentProofs((prev) => [...prev, ...Array.from(files)]);
    } else {
      showToast(STATUS.WARNING, WARNING_MESSAGES.MAX_DOCUMENT_PROOFS);
    }
  };

  const handleCertificationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && certifications.length + files.length <= 5) {
      setCertifications((prev) => [...prev, ...Array.from(files)]);
    } else {
      showToast(STATUS.WARNING, WARNING_MESSAGES.MAX_CERTIFICATIONS);
    }
  };

  const handleAchievementsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && achievements.length + files.length <= 5) {
      setAchievements((prev) => [...prev, ...Array.from(files)]);
    } else {
      showToast(STATUS.WARNING, WARNING_MESSAGES.MAX_ACHIEVEMENTS);
    }
  };

  const removeFile = (type: "document" | "certification" | "achievement", index: number) => {
    if (type === "document") {
      setDocumentProofs((prev) => prev.filter((_, i) => i !== index));
    } else if (type === "certification") {
      setCertifications((prev) => prev.filter((_, i) => i !== index));
    } else {
      setAchievements((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const mutation = useMutation({
    mutationFn: submitTrainerApplication,
    onSuccess: () => {
      showToast(STATUS.SUCCESS, SUCCESS_MESSAGES.TRAINER_APPLICATION_SUBMITED, 6000);
      reset();
      setDocumentProofs([]);
      setCertifications([]);
      setAchievements([]);
      navigate("/");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error?.response?.status === 409) {
          showToast(STATUS.WARNING, error.response.data.message);
        } else {
          showToast(STATUS.ERROR, ERR_MESSAGES.TRAINER_APPLICATION_SUBMIT_ERROR);
        }
      } else {
        showToast(STATUS.ERROR, ERR_MESSAGES.TRAINER_APPLICATION_SUBMIT_ERROR);
      }
    },
  });

  const onSubmit = (data: TrainerApplyFormData) => {
    if (documentProofs.length === 0) {
      return showToast(STATUS.WARNING, WARNING_MESSAGES.MIN_DOCUMENT_PROOFS);
    }
    if (certifications.length === 0) {
      return showToast(STATUS.WARNING, WARNING_MESSAGES.MIN_CERTIFICATIONS);
    }
    if (achievements.length === 0) {
      return showToast(STATUS.WARNING, WARNING_MESSAGES.MIN_ACHIEVEMENTS);
    }

    const formData = new FormData();
    formData.append("phone", data.phone);
    formData.append("specialization", data.specialization);
    formData.append("yearsOfExperience", data.yearsOfExperience);
    formData.append("about", data.about);

    documentProofs.forEach((file) => {
      formData.append("documentProofs", file);
    });

    certifications.forEach((file) => {
      formData.append("certifications", file);
    });

    achievements.forEach((file) => {
      formData.append("achievements", file);
    });

    mutation.mutate(formData);
  };

  if (isLoading) return <Loader message="Loading application status . . ."/>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative py-24 bg-gradient-to-r from-blue-600/90 to-purple-600/90 ">
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
            Become a Trainer
          </motion.h1>
          <motion.div variants={fadeIn} className="w-20 h-1 bg-white/30 mx-auto mb-6 rounded-full"></motion.div>
          <motion.p variants={fadeIn} className="text-white/80 max-w-2xl mx-auto">
            Join our team of expert trainers and help others achieve their fitness goals
          </motion.p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-10 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
        >
          {/* Show rejection reason if status is rejected */}
          {applicationStatus?.status === "rejected" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-red-50 rounded-xl p-6 border border-red-100"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <X className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-900">Application Rejected</h3>
                  <p className="text-red-600">reason : {applicationStatus.reason}</p>
                </div>
              </div>
              <p className="text-sm text-red-700">
                Please address the issues mentioned above and submit a new application.
              </p>
            </motion.div>
          )}

          {/* Show pending status */}
          {applicationStatus?.status === "pending" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Under Review</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Your application is currently being reviewed by our team. We'll notify you once a decision has been made.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-800 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300"
              >
                <ChevronLeft size={20} />
                <span>Back to Home</span>
              </motion.button>
            </motion.div>
          )}

          {applicationStatus?.status !== "pending" && applicationStatus?.status !== "approved" && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                    <p className="text-sm text-gray-500">Your contact and professional details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      {...register("phone")}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="text"
                      {...register("yearsOfExperience")}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="e.g. 5 years"
                    />
                    {errors.yearsOfExperience && (
                      <p className="text-red-500 text-sm mt-1">{errors.yearsOfExperience.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization
                  </label>
                  <input
                    type="text"
                    {...register("specialization")}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="e.g. Weight Training, Yoga, Nutrition"
                  />
                  {errors.specialization && (
                    <p className="text-red-500 text-sm mt-1">{errors.specialization.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About You
                  </label>
                  <textarea
                    {...register("about")}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Tell us about your career in fitness..."
                  />
                  {errors.about && (
                    <p className="text-red-500 text-sm mt-1">{errors.about.message}</p>
                  )}
                </div>
              </div>

              {/* Document Proofs */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Document Proofs</h3>
                    <p className="text-sm text-gray-500">Upload your identification documents</p>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                  {documentProofs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {documentProofs.map((file, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
                        >
                          <span className="text-sm text-gray-600 truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile("document", index)}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <X size={16} className="text-gray-500" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No documents uploaded yet</p>
                    </div>
                  )}

                  {documentProofs.length < 3 && (
                    <div className="text-center">
                      <label className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                        <Upload size={20} />
                        <span>Upload Documents</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleDocumentProofChange}
                          className="hidden"
                          multiple
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-2">Upload 1-3 document images</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Certifications */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Certifications</h3>
                    <p className="text-sm text-gray-500">Upload your fitness certifications</p>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                  {certifications.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {certifications.map((file, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
                        >
                          <span className="text-sm text-gray-600 truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile("certification", index)}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <X size={16} className="text-gray-500" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No certifications uploaded yet</p>
                    </div>
                  )}

                  {certifications.length < 5 && (
                    <div className="text-center">
                      <label className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                        <Upload size={20} />
                        <span>Upload Certifications</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCertificationsChange}
                          className="hidden"
                          multiple
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-2">Upload 1-5 certification images</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Achievements */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
                    <p className="text-sm text-gray-500">Upload your fitness achievements</p>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                  {achievements.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {achievements.map((file, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
                        >
                          <span className="text-sm text-gray-600 truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile("achievement", index)}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <X size={16} className="text-gray-500" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No achievements uploaded yet</p>
                    </div>
                  )}

                  {achievements.length < 5 && (
                    <div className="text-center">
                      <label className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                        <Upload size={20} />
                        <span>Upload Achievements</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAchievementsChange}
                          className="hidden"
                          multiple
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-2">Upload 1-5 achievement images</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={mutation.isPending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  mutation.isPending
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl hover:shadow-blue-500/25"
                }`}
              >
                {mutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-t-white/20 border-white rounded-full animate-spin"></div>
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    <span>Submit Application</span>
                  </>
                )}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default TrainerApply;