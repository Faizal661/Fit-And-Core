import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import {
  TrainerApplyFormData,
  trainerApplySchema,
} from "../../schemas/authSchema";
import { useToast } from "../../context/ToastContext";
import { submitTrainerApplication } from "../../services/authService";



const TrainerApply = () => {
  const { showToast } = useToast();
  const [documentProofs, setDocumentProofs] = useState<File[]>([]);
  const [certifications, setCertifications] = useState<File[]>([]);
  const [achievements, setAchievements] = useState<File[]>([]);

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
        "Your trainer application has been submitted successfully! Our team will review your application."
      );
      reset();
      setDocumentProofs([]);
      setCertifications([]);
      setAchievements([]);
    },
    onError: (error) => {
      console.error("Error submitting application:", error);
      if (axios.isAxiosError(error)) {
        if(error?.response?.status===409){
            showToast("warning", error.response.data.error);
        }else{
            showToast("error", "There was an error submitting your application. Please try again.");
        }
      } else {
        showToast("error", "There was an error submitting your application. Please try again.");
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

  return (
    <div className="min-h-screen bg-blue-800 flex flex-col items-center pt-6 pb-12 px-4">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <h1 className="text-white font-mono text-2xl mb-1">
            Welcome to the Fit-Core{" "}
          </h1>
          <p className="text-white font-mono text-xl">
            Apply to become a Trainer
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Phone */}
          <div>
            <label className="text-sm text-blue-300">PHONE</label>
            <input
              type="tel"
              {...register("phone")}
              className="w-full bg-transparent border-b border-blue-700 text-white pb-1 focus:outline-none"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Specialization */}
          <div>
            <label className="text-sm text-blue-300">SPECIALIZATION</label>
            <input
              type="text"
              {...register("specialization")}
              className="w-full bg-transparent border-b border-blue-700 text-white pb-1 focus:outline-none"
              placeholder="e.g. Weight Training, Yoga, Nutrition"
            />
            {errors.specialization && (
              <p className="text-red-500 text-xs mt-1">
                {errors.specialization.message}
              </p>
            )}
          </div>

          {/* Years of Experience */}
          <div>
            <label className="text-sm text-blue-300">YEARS OF EXPERIENCE</label>
            <input
              type="text"
              {...register("yearsOfExperience")}
              className="w-full bg-transparent border-b border-blue-700 text-white pb-1 focus:outline-none"
              placeholder="e.g. 5 years"
            />
            {errors.yearsOfExperience && (
              <p className="text-red-500 text-xs mt-1">
                {errors.yearsOfExperience.message}
              </p>
            )}
          </div>

          {/* About */}
          <div>
            <label className="text-sm text-blue-300">ABOUT</label>
            <textarea
              {...register("about")}
              className="w-full bg-transparent border-b border-blue-700 text-white pb-1 focus:outline-none"
              rows={4}
              placeholder="Tell us about your career in fitness..."
            />
            {errors.about && (
              <p className="text-red-500 text-xs mt-1">
                {errors.about.message}
              </p>
            )}
          </div>

          {/* Document Proofs */}
          <div className="pt-4">
            <h2 className="text-white mb-2">DOCUMENTS PROOF</h2>
            <div className="border border-blue-700 rounded-md p-4 mb-2">
              {documentProofs.length > 0 ? (
                <div className="space-y-2">
                  {documentProofs.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-blue-900 bg-opacity-50 p-2 rounded"
                    >
                      <span className="text-white text-sm truncate">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-300"
                        onClick={() => removeFile("document", index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-blue-300 text-sm">Upload Images</p>
                </div>
              )}
              {documentProofs.length < 3 && (
                <div className="mt-3">
                  <label
                    htmlFor="documentProofs"
                    className="cursor-pointer bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded-md block text-center text-sm"
                  >
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
                  <p className="text-blue-300 text-xs mt-1 text-center">
                    Min 1, Max 3 images
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h2 className="text-white mb-2">CERTIFICATIONS</h2>
            <div className="border border-blue-700 rounded-md p-4 mb-2">
              {certifications.length > 0 ? (
                <div className="space-y-2">
                  {certifications.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-blue-900 bg-opacity-50 p-2 rounded"
                    >
                      <span className="text-white text-sm truncate">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-300"
                        onClick={() => removeFile("certification", index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-blue-300 text-sm">Upload Images</p>
                </div>
              )}
              {certifications.length < 5 && (
                <div className="mt-3">
                  <label
                    htmlFor="certifications"
                    className="cursor-pointer bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded-md block text-center text-sm"
                  >
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
                  <p className="text-blue-300 text-xs mt-1 text-center">
                    Min 1, Max 5 images
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h2 className="text-white mb-2">ACHIEVEMENTS</h2>
            <div className="border border-blue-700 rounded-md p-4 mb-2">
              {achievements.length > 0 ? (
                <div className="space-y-2">
                  {achievements.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-blue-900 bg-opacity-50 p-2 rounded"
                    >
                      <span className="text-white text-sm truncate">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-300"
                        onClick={() => removeFile("achievement", index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-blue-300 text-sm">Upload Images</p>
                </div>
              )}
              {achievements.length < 5 && (
                <div className="mt-3">
                  <label
                    htmlFor="achievements"
                    className="cursor-pointer bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded-md block text-center text-sm"
                  >
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
                  <p className="text-blue-300 text-xs mt-1 text-center">
                    Min 1, Max 5 images
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="text-center mt-6 text-xs text-blue-300">
            I agree to the <span className="underline">Terms & Conditions</span>
            , <span className="underline">Disclaimer</span> and{" "}
            <span className="underline">Privacy Policy</span>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              {mutation.isPending ? "SUBMITTING..." : "SUBMIT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainerApply;
