import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  User,
  Activity,
  Apple,
  History,
  AlertCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTraineeData } from "../../../services/trainer/traineeManageService";
import TraineeProfileHeader from "../../../components/trainer/trainee-management/TraineeProfileHeader";
import TraineeInfoTab from "../../../components/trainer/trainee-management/tabs/TraineeInfoTab";
import TraineeProgressTab from "../../../components/trainer/trainee-management/tabs/TraineeProgressTab";
import TraineeNutritionTab from "../../../components/trainer/trainee-management/tabs/TraineeNutritionTab";
import TraineeHistoryTab from "../../../components/trainer/trainee-management/tabs/TraineeHistoryTab";

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

type Tab = "info" | "progress" | "nutrition" | "history";


// Utility function for formatting dates
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const TraineeDetailsPage = () => {
  const { traineeId } = useParams<{ traineeId: string }>();
  const [activeTab, setActiveTab] = useState<Tab>("info");
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const {
    data: traineeData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["traineeData", traineeId],
    queryFn: () => getTraineeData(traineeId!),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trainee data...</p>
        </div>
      </div>
    );
  }

  if (error || !traineeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-xl shadow max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            Failed to load trainee data
          </h3>
          <p className="text-gray-600 mb-4">
            There was an error fetching the trainee information. Please try
            again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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

        <TraineeProfileHeader
          traineeData={traineeData}
          ref={ref}
          inView={inView}
          staggerContainer={staggerContainer}
          fadeIn={fadeIn}
          formatDate={formatDate}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 -mt-14 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden"
        >
          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-100 overflow-x-auto ">
            <TabButton
              icon={<User size={18} />}
              label="Basic Information"
              tabName="info"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <TabButton
              icon={<Activity size={18} />}
              label="Progress Tracking"
              tabName="progress"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <TabButton
              icon={<Apple size={18} />}
              label="Nutrition"
              tabName="nutrition"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <TabButton
              icon={<History size={18} />}
              label="History"
              tabName="history"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          <div className="p-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 ">
            {activeTab === "info" && (
              <TraineeInfoTab traineeData={traineeData} />
            )}
            {activeTab === "progress" && (
              <TraineeProgressTab traineeData={traineeData} />
            )}
            {activeTab === "nutrition" && (
              <TraineeNutritionTab traineeData={traineeData} />
            )}
            {activeTab === "history" && (
              <TraineeHistoryTab
                traineeData={traineeData}
                formatDate={formatDate}
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Tab Button Component
interface TabButtonProps {
  icon: React.ReactNode;
  label: string;
  tabName: Tab;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const TabButton = ({
  icon,
  label,
  tabName,
  activeTab,
  setActiveTab,
}: TabButtonProps) => {
  return (
    <button
      onClick={() => setActiveTab(tabName as Tab)}
      className={`flex items-center gap-2 py-4 px-6 transition-colors duration-300 ${
        activeTab === tabName
          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
};

export default TraineeDetailsPage;
