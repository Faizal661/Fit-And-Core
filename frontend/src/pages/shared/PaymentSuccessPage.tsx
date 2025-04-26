import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { verifyPayment } from "../../services/stripe/subscriptionPlan";
import { motion } from "framer-motion";
import { Check, Home, Users, ChevronRight} from "lucide-react";
import Loader from "../../components/shared/Loader";
import ErrorPage from "../../components/shared/ErrorPage";

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

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      navigate("/");
    }
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["paymentVerification", sessionId],
    queryFn: () => verifyPayment(sessionId),
    enabled: !!sessionId,
    retry: 1,
  });

  const subscription = data?.subscription;

  if (isLoading) return <Loader message="Verifying your payment . . ." />;

  if (isError)
    return (
      <ErrorPage
        title="Verification Failed"
        message="We couldn't verify your payment. Please contact our support team for assistance."
      />
    );


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 p-8 text-center relative">
          <div
            className="absolute inset-0 bg-black/10 z-0 opacity-30"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          ></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              ₹ {subscription.amount}
            </h1>
            <h2 className="text-xl text-white/90 mb-2">Payment Successful</h2>
            <div className="w-20 h-1 bg-white/30 mx-auto"></div>
          </div>
        </div>

        <div className="p-8">
          {subscription && (
            <div className="space-y-6 mb-8">
              <div className="p-4 bg-gray-50 rounded-xl">
                <h2 className="text-sm text-gray-500 mb-1">Plan Duration</h2>
                <p className="text-lg font-medium text-gray-900">
                  {subscription.planDuration}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <h2 className="text-sm text-gray-500 mb-1">Trainer</h2>
                <p className="text-lg font-medium text-gray-900">
                  {subscription.trainerName}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <h2 className="text-sm text-gray-500 mb-1">Valid Until</h2>
                <p className="text-lg font-medium text-gray-900">
                  {new Date(subscription.expiryDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/")}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Home size={20} />
              <span>Return to Homepage</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/find-trainers")}
              className="w-full py-4 px-6 bg-gray-100 text-gray-800 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Users size={20} />
              <span>Find More Trainers</span>
              <ChevronRight size={20} className="opacity-50" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccessPage;
