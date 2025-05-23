// File: src/components/trainee/tabs/TraineeInfoTab.tsx
import { motion } from "framer-motion";
import { User, Scale, TrendingUp } from "lucide-react";
import { TraineeData } from "../../../../types/trainee.type";

interface TraineeInfoTabProps {
  traineeData: TraineeData;
}

const TraineeInfoTab = ({ traineeData }: TraineeInfoTabProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Physical Stats */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Id</p>
              <p className="font-semibold">
                {traineeData.traineeId
                  ? `${traineeData.traineeId} `
                  : "Not provided"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Scale className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">username</p>
              <p className="font-semibold">
                {traineeData.username || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="text-emerald-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">username</p>
              <p className="font-semibold">
                {traineeData.username || "Not provided"}
              </p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Fitness Goals - Uncomment when needed
      <div>
        <h3 className="text-lg font-semibold mb-4">Fitness Goals</h3>
        {traineeData.goals && traineeData.goals.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {traineeData.goals.map((goal, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
              >
                {goal}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No fitness goals have been set yet.
          </p>
        )}
      </div>
      */}

      {/* Member Status */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Member Status</h3>
        <div
          className={`p-4 rounded-lg flex items-center gap-3 ${
            traineeData.isBlocked ? "bg-red-50" : "bg-green-50"
          }`}
        >
          <div
            className={`w-3 h-3 rounded-full ${
              traineeData.isBlocked ? "bg-red-500" : "bg-green-500"
            }`}
          ></div>
          <span
            className={`font-medium ${
              traineeData.isBlocked
                ? "text-red-700"
                : "text-green-700"
            }`}
          >
            {traineeData.isBlocked ? "Blocked" : "Active"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default TraineeInfoTab;