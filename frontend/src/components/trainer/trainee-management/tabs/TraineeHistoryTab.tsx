// File: src/components/trainee/tabs/TraineeHistoryTab.tsx
import { motion } from "framer-motion";
import { Calendar, Award, Clock, Timer } from "lucide-react";
import { SubscriptionHistory, TraineeData } from "../../../../types/trainee.type";

interface TraineeHistoryTabProps {
  traineeData: TraineeData;
  formatDate: (dateString: string) => string;
}

const TraineeHistoryTab = ({ traineeData, formatDate }: TraineeHistoryTabProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Subscription History */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Subscription History
        </h3>
        {traineeData.subscriptionHistory &&
        traineeData.subscriptionHistory.length > 0 ? (
          <div className="space-y-4">
            {traineeData.subscriptionHistory.map((subscription: SubscriptionHistory) => (
              <div
                key={subscription._id}
                className="p-6 bg-gray-50 rounded-xl border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Award className="text-green-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        {subscription.planDuration} Plan
                      </h4>
                      <p className="text-sm text-gray-500">
                        ₹{subscription.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      subscription.status === "active"
                        ? "bg-green-100 text-green-600"
                        : subscription.status === "expired"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {subscription.status.charAt(0).toUpperCase() +
                      subscription.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>
                      Start: {formatDate(subscription.startDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>
                      End: {formatDate(subscription.expiryDate)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-gray-50 rounded-xl text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">
              No subscription history available
            </p>
          </div>
        )}
      </div>

      {/* Session History - This section remains with placeholder for now */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Session History
        </h3>
        <div className="p-6 bg-gray-50 rounded-xl text-center">
          <Timer className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">
            Session history feature coming soon
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TraineeHistoryTab;