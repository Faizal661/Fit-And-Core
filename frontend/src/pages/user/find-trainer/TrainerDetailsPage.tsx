import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "../../../config/axios.config";
import { Trainer } from "../../../types/trainer.type";
import { Skeleton } from "@mui/material";
import Footer from "../../../components/shared/Footer";

const TrainerDetailsPage = () => {
  const { trainerId } = useParams<{ trainerId: string }>();

  const {
    data: trainer,
    isLoading,
    error,
  } = useQuery<Trainer>({
    queryKey: ["trainer", trainerId],
    queryFn: async () => {
      const response = await axios.get(`/trainer/${trainerId}`);
      return response.data.trainerData;
    },
  });

  if (!trainer)
    return (
      <div className="min-h-screen pt-16 min-w-4xl mx-auto">
        {" "}
        <h1 className="text-3xl font-bold mb-6">Trainer Details</h1>
        <p className="text-xl  mb-6">Trainer not found</p>{" "}
      </div>
    );

  const subscriptionPlans = [
    { duration: "1 Month", amount: "₹1500", savings: 0 },
    { duration: "6 Months", amount: "₹7500", savings: 1500 },
    { duration: "12 Months", amount: "₹13500", savings: 4500 },
  ];

  return (
    <div>
      <div className="min-h-screen bg-white p-8 pt-16">
        {isLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            <Skeleton height={120} animation="wave" />
            <Skeleton height={320} animation="wave" />
            <Skeleton height={120} animation="wave" />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-xl text-gray-800 mb-12">Trainer details</h1>
            <div className="border border-slate-300 p-8 rounded">
              <div className="flex items-center gap-6 mb-6">
                {trainer.profilePicture && (
                  <img
                    src={trainer.profilePicture}
                    alt={`${trainer.username}'s profile`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <h2 className="text-lg">{trainer.username}</h2>
              </div>

              <div className="space-y-4 mb-12">
                <div className="flex">
                  <span className="text-gray-400 text-sm w-36">Email</span>
                  <span className="text-gray-600 text-sm">{trainer.email}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-400 text-sm w-36">Phone</span>
                  <span className="text-gray-600 text-sm">{trainer.phone}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-400 text-sm w-36">
                    Specialization
                  </span>
                  <span className="text-gray-600 text-sm">
                    {trainer.specialization}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-400 text-sm w-36">Experience</span>
                  <span className="text-gray-600 text-sm">
                    {trainer.yearsOfExperience} years
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-400 text-sm w-36">Joined</span>
                  <span className="text-gray-600 text-sm">
                    {new Date(trainer.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-300 pt-6 mb-8">
                <h3 className="text-base mb-4">About</h3>
                <p className="text-sm text-gray-600">{trainer.about}</p>
              </div>

              <div className="space-y-8">
                {trainer.documentProofs &&
                  trainer.documentProofs.length > 0 && (
                    <div>
                      <h3 className="text-base mb-4">Document proofs</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {trainer.documentProofs.map((proof, index) => (
                          <div
                            key={index}
                            className="border border-slate-300 p-2 rounded"
                          >
                            <img
                              src={proof}
                              alt={`Document proof ${index + 1}`}
                              className="w-full h-40 object-cover"
                              onClick={() => window.open(proof, "_blank")}
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {trainer.certifications &&
                  trainer.certifications.length > 0 && (
                    <div>
                      <h3 className="text-base mb-4">Certifications</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {trainer.certifications.map((cert, index) => (
                          <div
                            key={index}
                            className="border border-slate-300 p-2 rounded"
                          >
                            <img
                              src={cert}
                              alt={`Certification ${index + 1}`}
                              className="w-full h-40 object-cover"
                              onClick={() => window.open(cert, "_blank")}
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {trainer.achievements && trainer.achievements.length > 0 && (
                  <div>
                    <h3 className="text-base mb-4">Achievements</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {trainer.achievements.map((achieve, index) => (
                        <div
                          key={index}
                          className="border border-slate-300 p-2 rounded"
                        >
                          <img
                            src={achieve}
                            alt={`Achievement ${index + 1}`}
                            className="w-full h-40 object-cover"
                            onClick={() => window.open(achieve, "_blank")}
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {subscriptionPlans && subscriptionPlans.length > 0 && (
                  <div>
                    <h3 className="text-base mb-6">Subscription plans</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {subscriptionPlans.map((plan, index) => {
                        return (
                          <div
                            key={index}
                            className="border border-slate-300 rounded-lg p-6 hover:shadow-md transition-shadow relative overflow-hidden"
                          >
                            {index === 1 && (
                              <div className="absolute top-0 right-0 bg-green-500 text-white text-xs py-1 px-3 rounded-bl-lg">
                                Popular
                              </div>
                            )}
                            <h4 className="font-medium text-base mb-2">
                              {plan.duration}
                            </h4>
                            <div className="mb-2">
                              <span className="text-xl font-bold text-gray-800">
                                {plan.amount}
                              </span>
                            </div>

                            {
                              <div className="mb-4 bg-green-50 text-green-700 text-xs font-medium py-1 px-2 rounded inline-block">
                                {plan.savings > 0 && ` Save ₹${plan.savings}`}
                              </div>
                            }

                            <div className="space-y-2 mb-6">
                              <div className="flex items-start">
                                <svg
                                  className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="text-sm text-gray-600">
                                  Personalized training
                                </span>
                              </div>
                              <div className="flex items-start">
                                <svg
                                  className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="text-sm text-gray-600">
                                  Nutrition advice
                                </span>
                              </div>
                              <div className="flex items-start">
                                <svg
                                  className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="text-sm text-gray-600">
                                  Progress tracking
                                </span>
                              </div>
                              <div className="flex items-start">
                                <svg
                                  className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="text-sm text-gray-600">
                                  Priority support
                                </span>
                              </div>
                            </div>
                            <button
                              className={`w-full py-2 px-4 rounded text-sm font-medium hover:bg-green-500 hover:text-white bg-slate-100 text-gray-800 transition-colors`}
                            >
                              Choose plan
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};
export default TrainerDetailsPage;
