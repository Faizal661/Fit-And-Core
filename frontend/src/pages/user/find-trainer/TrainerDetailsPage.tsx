import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { Trainer } from "../../../types/trainer.type";
import { useToast } from "../../../context/ToastContext";
import Footer from "../../../components/shared/Footer";
import PageNotFound from "../../../components/shared/PageNotFound";
import {
  SubscriptionStatus,
  subscriptionPlans,
} from "../../../types/subscription.type";
import { loadStripe } from "@stripe/stripe-js";
import {
  checkSubscriptionStatus,
  createCheckoutSession,
} from "../../../services/stripe/subscriptionService";
import { STATUS } from "../../../constants/status.messges";
import { REDIRECT_MESSAGES } from "../../../constants/redirect.messges";
import { getTrainerData } from "../../../services/trainer/trainerService";
import { ERR_MESSAGES } from "../../../constants/error.messages";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Medal,
  Clock,
  Mail,
  Phone,
  Award,
  FileText,
  Star,
  ChevronRight,
} from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

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

const TrainerDetailsPage = () => {
  const { trainerId } = useParams<{ trainerId: string }>();
  const { showToast } = useToast();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { data: trainer, isLoading } = useQuery<Trainer>({
    queryKey: ["trainer", trainerId],
    queryFn: () => getTrainerData(trainerId),
  });

  const {
    data: subscriptionData,
    isLoading: subscriptionLoading,
    error: subscriptionError,
  } = useQuery<SubscriptionStatus>({
    queryKey: ["subscriptionStatus", trainerId],
    queryFn: () => checkSubscriptionStatus(trainerId!),
    enabled: !!trainerId,
  });

  const checkoutMutation = useMutation({
    mutationFn: createCheckoutSession,
    onSuccess: async (data) => {
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({
        sessionId: data.stripeSessionId,
      });
    },
    onError: (error) => {
      console.error(ERR_MESSAGES.PAYMENT_ERROR, error);
      showToast(STATUS.ERROR, ERR_MESSAGES.PAYMENT_ERROR);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trainer details...</p>
        </div>
      </div>
    );
  }

  if (!trainer) {
    return trainerId?.length === 24 ? (
      <PageNotFound
        message={REDIRECT_MESSAGES.FAILED_TO_LOAD_TRAINER_DATA}
        linkText={REDIRECT_MESSAGES.VIEW_ALL_AVAILABLE_TRAINERS}
        linkTo="/find-trainers"
      />
    ) : (
      <PageNotFound
        message={REDIRECT_MESSAGES.NO_TRAINER_FOUND}
        linkText={REDIRECT_MESSAGES.VIEW_ALL_AVAILABLE_TRAINERS}
        linkTo="/find-trainers"
      />
    );
  }

  const subscriptionPlans = [
    { duration: "1 Month", amount: "₹1500", amountInPaise: 150000, savings: 0 },
    {
      duration: "6 Months",
      amount: "₹7500",
      amountInPaise: 750000,
      savings: 1500,
    },
    {
      duration: "12 Months",
      amount: "₹13500",
      amountInPaise: 1350000,
      savings: 4500,
    },
  ];

  const features = [
    "Personalized training programs",
    "Nutrition guidance and meal plans",
    "24/7 chat support",
    "Weekly progress tracking",
    "Video call consultations",
    "Custom workout schedules",
  ];

  const handleSubscription = (plan: subscriptionPlans) => {
    checkoutMutation.mutate({
      trainerId: trainer._id,
      planDuration: plan.duration,
      amountInPaise: plan.amountInPaise,
      planName: `${trainer.username} - ${plan.duration} Training Plan`,
    });
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
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        >
          <div className="mb-8">
            <img
              src={trainer.profilePicture}
              alt={trainer.username}
              className="w-32 h-32 rounded-full border-4 border-white/20 mx-auto object-cover shadow-xl"
            />
          </div>
          <motion.h1
            variants={fadeIn}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            {trainer.username}
          </motion.h1>
          <motion.div
            variants={fadeIn}
            className="w-20 h-1 bg-white/30 mx-auto mb-6 rounded-full"
          ></motion.div>
          <motion.div
            variants={fadeIn}
            className="flex items-center justify-center gap-6 text-white/80"
          >
            <div className="flex items-center gap-2">
              <Medal size={18} />
              <span>{trainer.specialization}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{trainer.yearsOfExperience} experience</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 mb-16"
        >
          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <Mail className="text-blue-600" size={24} />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{trainer.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <Phone className="text-emerald-600" size={24} />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{trainer.phone}</p>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">About Me</h2>
            <p className="text-gray-600 leading-relaxed">{trainer.about}</p>
          </div>

          {/* Documents & Certifications */}
          <div className="space-y-12 mb-12">
            {trainer.documentProofs && trainer.documentProofs.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="text-blue-600" size={24} />
                  <h2 className="text-2xl font-bold">Document Proofs</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {trainer.documentProofs.map((proof, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5 }}
                      className="overflow-hidden rounded-xl shadow-lg border border-gray-100"
                    >
                      <img
                        src={proof}
                        alt={`Document proof ${index + 1}`}
                        className="w-full h-48 object-cover cursor-pointer transition-transform duration-300 hover:scale-110"
                        onClick={() => window.open(proof, "_blank")}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {trainer.certifications && trainer.certifications.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Award className="text-purple-600" size={24} />
                  <h2 className="text-2xl font-bold">Certifications</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {trainer.certifications.map((cert, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5 }}
                      className="overflow-hidden rounded-xl shadow-lg border border-gray-100"
                    >
                      <img
                        src={cert}
                        alt={`Certification ${index + 1}`}
                        className="w-full h-48 object-cover cursor-pointer transition-transform duration-300 hover:scale-110"
                        onClick={() => window.open(cert, "_blank")}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {trainer.achievements && trainer.achievements.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Star className="text-amber-600" size={24} />
                  <h2 className="text-2xl font-bold">Achievements</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {trainer.achievements.map((achieve, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5 }}
                      className="overflow-hidden rounded-xl shadow-lg border border-gray-100"
                    >
                      <img
                        src={achieve}
                        alt={`Achievement ${index + 1}`}
                        className="w-full h-48 object-cover cursor-pointer transition-transform duration-300 hover:scale-110"
                        onClick={() => window.open(achieve, "_blank")}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Subscription Plans */}
          {subscriptionLoading ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading subscription plans...</p>
            </div>
          ) : subscriptionError ? (
            <div className="text-center py-8 bg-red-50 rounded-xl border border-red-100">
              <p className="text-red-600">
                Failed to load subscription plans. Please try again later.
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-8">Training Plans</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan, index) => {
                  const isCurrentPlan =
                    subscriptionData?.isSubscribed &&
                    plan.duration ===
                      subscriptionData.subscription?.planDuration;

                  return (
                    <motion.div
                      key={plan.duration}
                      whileHover={!isCurrentPlan ? { y: -5 } : {}}
                      className={`rounded-xl border ${
                        isCurrentPlan
                          ? "bg-green-50 border-green-200"
                          : "border-gray-200 hover:border-blue-200"
                      } p-6 relative overflow-hidden`}
                    >
                      {index === 1 && !subscriptionData?.isSubscribed && (
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs py-1 px-3 rounded-bl-lg">
                          Popular
                        </div>
                      )}
                      {isCurrentPlan && (
                        <div className="absolute top-0 right-0 bg-green-600 text-white text-xs py-1 px-3 rounded-bl-lg">
                          Current Plan
                        </div>
                      )}

                      <h3 className="text-xl font-bold mb-2">
                        {plan.duration}
                      </h3>
                      <div className="mb-4">
                        <span className="text-3xl font-bold">
                          {plan.amount}
                        </span>
                      </div>

                      <div className="mb-4 inline-block ">
                        {plan.savings > 0 && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                            Save ₹{plan.savings}
                          </span>
                        )}
                      </div>

                      <div className="space-y-3 mb-6">
                        {features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <ChevronRight
                              size={18}
                              className="text-green-500 flex-shrink-0 mt-0.5"
                            />
                            <span className="text-sm text-gray-600">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>

                      <motion.button
                        whileHover={!isCurrentPlan ? { scale: 1.02 } : {}}
                        whileTap={!isCurrentPlan ? { scale: 0.98 } : {}}
                        disabled={isCurrentPlan || checkoutMutation.isPending}
                        onClick={() => handleSubscription(plan)}
                        className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                          isCurrentPlan
                            ? "bg-green-600 text-white cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-blue-500/25"
                        } ${checkoutMutation.isPending ? "cursor-progress":"" }`}
                      >
                        {isCurrentPlan
                          ? "Current Plan"
                          : subscriptionData?.isSubscribed
                          ? "Upgrade Plan"
                          : "Choose Plan"}
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default TrainerDetailsPage;
