import { motion } from "framer-motion";
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