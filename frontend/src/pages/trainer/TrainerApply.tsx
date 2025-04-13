import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  TrainerApplyFormData,
  trainerApplySchema,
} from "../../schemas/authSchema";
import { useToast } from "../../context/ToastContext";
import { submitTrainerApplication } from "../../services/authService";
import {
  ApplicationStatus,
  checkTrainerApplicationStatus,
} from "../../services/trainer/trainerService";
import Footer from "../../components/shared/Footer";

const TrainerApply = () => {
  const navigate = useNavigate();
  const processedRef = useRef(false);

  const { showToast } = useToast();
  const [documentProofs, setDocumentProofs] = useState<File[]>([]);
  const [certifications, setCertifications] = useState<File[]>([]);
  const [achievements, setAchievements] = useState<File[]>([]);

  const { data: applicationStatus, isLoading } = useQuery<
    ApplicationStatus,
    Error
  >({
    queryKey: ["trainerApplicationStatus"],
    queryFn: checkTrainerApplicationStatus,
  });
  useEffect(() => {
    if (processedRef.current) return;

    if (applicationStatus) {
      processedRef.current = true;
      if (applicationStatus.status === "pending") {
        showToast(
          "info",
          "Your trainer application is currently under review."
        );
        // navigate("/")
      } else if (applicationStatus.status === "approved") {
        showToast(
          "success",
          "Your trainer application has been approved! Please log out and log in to access trainer functionalities.",
          10000
        );
        navigate("/");
      } else if (applicationStatus.status === "rejected") {
        showToast(
          "warning",
          "Previous Application Rejected , Please address the issue and apply again. "
        );
      }
    }
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

  const handleDocumentProofChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files && documentProofs.length + files.length <= 3) {
      setDocumentProofs((prev) => [...prev, ...Array.from(files)]);
    } else {
      showToast("warning", "Maximum 3 document proofs allowed");
    }
  };

  const handleCertificationsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files && certifications.length + files.length <= 5) {
      setCertifications((prev) => [...prev, ...Array.from(files)]);
    } else {
      showToast("warning", "Maximum 5 certifications allowed");
    }
  };

  const handleAchievementsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && achievements.length + files.length <= 5) {
      setAchievements((prev) => [...prev, ...Array.from(files)]);
    } else {
      showToast("warning", "Maximum 5 achievements allowed");
    }
  };

  const removeFile = (
    type: "document" | "certification" | "achievement",
    index: number
  ) => {
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
      showToast(
        "success",
        "Your trainer application has been submitted successfully! Our team will review your application.",
        10000
      );
      reset();
      setDocumentProofs([]);
      setCertifications([]);
      setAchievements([]);
      navigate("/");
    },
    onError: (error) => {
      console.error("Error submitting application:", error);
      if (axios.isAxiosError(error)) {
        if (error?.response?.status === 409) {
          showToast("warning", error.response.data.message);
        } else {
          showToast(
            "error",
            "There was an error submitting your application. Please try again."
          );
        }
      } else {
        showToast(
          "error",
          "There was an error submitting your application. Please try again."
        );
      }
    },
  });

  const onSubmit = (data: TrainerApplyFormData) => {
    if (documentProofs.length === 0) {
      return showToast("warning", "Please upload at least one document proof");
    }
    if (certifications.length === 0) {
      return showToast("warning", "Please upload at least one certification");
    }
    if (achievements.length === 0) {
      return showToast("warning", "Please upload at least one achievement");
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

  if (isLoading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-grow container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-gray-800 font-semibold text-3xl mb-2">
              Become a Trainer
            </h1>
            <p className="text-gray-600 text-lg">Apply to join our Fit-Core team.</p>
          </div>

          {/* Show rejection reason if status is rejected */}
          {applicationStatus?.status === "rejected" && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 rounded-md">
              <p className="font-semibold">Application Rejected</p>
              <p className="text-sm">
                <span className="font-medium">Reason:</span> {applicationStatus.reason}
              </p>
              <p className="text-sm">
                <span className="font-medium">Note:</span> Please address the issue and apply again below.
              </p>
            </div>
          )}

          {/* Show pending status */}
          {applicationStatus?.status === "pending" && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-5 mb-6 rounded-md text-center">
              <p className="font-semibold text-xl mb-3">
                Your Application is Under Review
              </p>
              <p className="text-sm">
                <span className="font-medium">Note:</span> Please be patient, we will inform you about the status once it's updated.
              </p>
              <button
                type="button"
                className="mt-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={() => navigate("/")}
              >
                Back
              </button>
            </div>
          )}

          {applicationStatus?.status !== "pending" &&
            applicationStatus?.status !== "approved" && (
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <div className="mt-1">
                    <input
                      type="tel"
                      id="phone"
                      {...register("phone")}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                  )}
                </div>

                {/* Specialization */}
                <div>
                  <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                    Specialization
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="specialization"
                      {...register("specialization")}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g. Weight Training, Yoga, Nutrition"
                    />
                  </div>
                  {errors.specialization && (
                    <p className="text-red-500 text-xs mt-1">{errors.specialization.message}</p>
                  )}
                </div>

                {/* Years of Experience */}
                <div>
                  <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">
                    Years of Experience
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="yearsOfExperience"
                      {...register("yearsOfExperience")}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g. 5 years"
                    />
                  </div>
                  {errors.yearsOfExperience && (
                    <p className="text-red-500 text-xs mt-1">{errors.yearsOfExperience.message}</p>
                  )}
                </div>

                {/* About */}
                <div>
                  <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                    About
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="about"
                      {...register("about")}
                      rows={3}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Tell us about your career in fitness..."
                    />
                  </div>
                  {errors.about && (
                    <p className="text-red-500 text-xs mt-1">{errors.about.message}</p>
                  )}
                </div>

                {/* Document Proofs */}
                <div className="pt-4">
                  <h2 className="text-lg font-medium text-gray-800 mb-2">Document Proofs</h2>
                  <div className="border border-gray-300 rounded-md p-4">
                    {documentProofs.length > 0 ? (
                      <div className="space-y-2">
                        {documentProofs.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-100 p-2 rounded-md"
                          >
                            <span className="text-gray-700 text-sm truncate">{file.name}</span>
                            <button
                              type="button"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => removeFile("document", index)}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <p className="text-gray-500 text-sm">No documents uploaded.</p>
                      </div>
                    )}
                    {documentProofs.length < 3 && (
                      <div className="mt-3">
                        <label
                          htmlFor="documentProofs"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer w-full justify-center"
                        >
                          <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"></path></svg>
                          Upload Images
                        </label>
                        <input
                          id="documentProofs"
                          type="file"
                          accept="image/*"
                          onChange={handleDocumentProofChange}
                          className="hidden"
                          multiple
                        />
                        <p className="text-gray-500 text-xs mt-1 text-center">Min 1, Max 3 images</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h2 className="text-lg font-medium text-gray-800 mb-2">Certifications</h2>
                  <div className="border border-gray-300 rounded-md p-4">
                    {certifications.length > 0 ? (
                      <div className="space-y-2">
                        {certifications.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-100 p-2 rounded-md"
                          >
                            <span className="text-gray-700 text-sm truncate">{file.name}</span>
                            <button
                              type="button"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => removeFile("certification", index)}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <p className="text-gray-500 text-sm">No certifications uploaded.</p>
                      </div>
                    )}
                    {certifications.length < 5 && (
                      <div className="mt-3">
                        <label
                          htmlFor="certifications"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer w-full justify-center"
                        >
                          <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"></path></svg>
                          Upload Images
                        </label>
                        <input
                          id="certifications"
                          type="file"
                          accept="image/*"
                          onChange={handleCertificationsChange}
                          className="hidden"
                          multiple
                        />
                        <p className="text-gray-500 text-xs mt-1 text-center">Min 1, Max 5 images</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h2 className="text-lg font-medium text-gray-800 mb-2">Achievements</h2>
                  <div className="border border-gray-300 rounded-md p-4">
                    {achievements.length > 0 ? (
                      <div className="space-y-2">
                        {achievements.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-100 p-2 rounded-md"
                          >
                            <span className="text-gray-700 text-sm truncate">{file.name}</span>
                            <button
                              type="button"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => removeFile("achievement", index)}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <p className="text-gray-500 text-sm">No achievements uploaded.</p>
                      </div>
                    )}
                    {achievements.length < 5 && (
                      <div className="mt-3">
                        <label
                          htmlFor="achievements"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer w-full justify-center"
                        >
                          <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"></path></svg>
                          Upload Images
                        </label>
                        <input
                          id="achievements"
                          type="file"
                          accept="image/*"
                          onChange={handleAchievementsChange}
                          className="hidden"
                          multiple
                        />
                        <p className="text-gray-500 text-xs mt-1 text-center">Min 1, Max 5 images</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full py-3  bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    {mutation.isPending ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </form>
            )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TrainerApply;
