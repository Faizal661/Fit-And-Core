// File: src/components/trainee/tabs/TraineeNutritionTab.tsx
import { motion } from "framer-motion";
import { Apple } from "lucide-react";
import { TraineeData } from "../../../../types/trainee.type";

interface TraineeNutritionTabProps {
  traineeData: TraineeData;
}

const TraineeNutritionTab = ({ traineeData }: TraineeNutritionTabProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-12"
    >
      <Apple className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">
        Nutrition Tracking Coming Soon
      </h3>
      <p className="text-gray-500">
        Detailed nutrition tracking and meal planning features for{" "}
        {traineeData.username} are on the way.
      </p>
    </motion.div>
  );
};

export default TraineeNutritionTab;