import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ResponsiveCalendar } from "@nivo/calendar";
import {
  Flame,
  Trophy,
  Calendar,
  TrendingUp,
  Activity,
  ChevronDown,
} from "lucide-react";
import Footer from "../../components/shared/Footer";
import {
  getHeatmapData,
  getStreakData,
} from "../../services/streak/streakService";
import { HeatmapData, StreakData } from "../../types/streak.type";

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

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const UserStreakPage = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Fetch streak data
  const { data: streakData, isLoading: streakLoading } = useQuery<StreakData>({
    queryKey: ["userStreak"],
    queryFn: getStreakData,
  });

  // Fetch heatmap data
  const { data: heatmapData, isLoading: heatmapLoading } = useQuery<
    HeatmapData[]
  >({
    queryKey: ["userHeatmap", selectedYear],
    queryFn: () => getHeatmapData(selectedYear),
  });

  const startDate = `${selectedYear}-01-01`;
  const endDate = `${selectedYear}-12-31`;

  const colors = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];

  const yearOptions = [2024, 2025];

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
          className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        >
          <motion.div
            variants={fadeIn}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <Flame size={32} className="text-white" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Activity Streak
            </h1>
          </motion.div>
          <motion.div
            variants={fadeIn}
            className="w-20 h-1 bg-white/30 mx-auto mb-6 rounded-full"
          ></motion.div>
          <motion.p
            variants={fadeIn}
            className="text-white/80 max-w-2xl mx-auto"
          >
            Track your fitness journey and maintain your daily activity streak
          </motion.p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-10">
        {/* Streak Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {/* Current Streak */}
          <motion.div
            variants={scaleIn}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Flame className="text-white" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Current Streak
              </h3>
              <p className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                {streakLoading ? "..." : streakData?.currentStreak}
              </p>
              <p className="text-sm text-gray-500 mt-2">days in a row</p>
            </div>
          </motion.div>

          {/* Max Streak */}
          <motion.div
            variants={scaleIn}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="text-white" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Best Streak
              </h3>
              <p className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent">
                {streakLoading ? "..." : streakData?.maxStreak}
              </p>
              <p className="text-sm text-gray-500 mt-2">personal record</p>
            </div>
          </motion.div>

          {/* Total Activities */}
          <motion.div
            variants={scaleIn}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="text-white" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Total Activities Days
              </h3>
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                {streakLoading ? "..." : streakData?.totalActivities}
              </p>
              <p className="text-sm text-gray-500 mt-2">all time</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Activity Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 mb-16"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold">Activity Heatmap</h2>
            </div>

            {/* Year Selector */}
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={18}
              />
            </div>
          </div>

          {heatmapLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : heatmapData && heatmapData.length > 0 ? (
            <div style={{ height: "200px" }}>
              <ResponsiveCalendar
                data={heatmapData}
                from={startDate}
                to={endDate}
                emptyColor="#f3f4f6"
                minValue={-10}
                maxValue={50}
                colors={colors}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                yearSpacing={40}
                monthSpacing={10}
                monthBorderWidth={0}
                monthBorderColor="#ffffff"
                monthLegendPosition="after"
                monthLegendOffset={15}
                dayBorderWidth={2}
                dayBorderColor="#ffffff"
                tooltip={({ day, value }) => (
                  <div className="bg-white px-3 py-2 w-[100px] rounded-lg shadow-lg border border-gray-200 text-sm">
                    <div className="font-medium text-gray-900 w-full">{day}</div>
                    <div className="text-gray-600">
                      score : {value || 0}
                    </div>
                  </div>
                )}
                legends={[
                  {
                    anchor: "bottom-right",
                    direction: "row",
                    translateY: 36,
                    itemCount: 4,
                    itemWidth: 42,
                    itemHeight: 36,
                    itemsSpacing: 14,
                    itemDirection: "right-to-left",
                  },
                ]}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <TrendingUp size={48} className="mb-4" />
              <p className="text-lg font-medium">No activity data available</p>
              <p className="text-sm">
                Start your fitness journey to see your progress here
              </p>
            </div>
          )}

          {/* Activity Legend */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-center text-sm text-gray-600 gap-10">
              <span>Less</span>
              <div className="flex items-center gap-1">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </motion.div>

        {/* Motivational Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 rounded-xl p-8 text-center text-white mb-16 relative overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-black/10 z-0 opacity-30"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            }}
          ></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4">
              Keep the Momentum Going! 🔥
            </h3>
            <p className="text-white/90 max-w-2xl mx-auto">
              {(streakData?.currentStreak ?? 0) > 0
                ? `You're on a ${streakData?.currentStreak}-day streak! Don't break the chain - complete your workout today.`
                : "Start your fitness journey today and build an amazing streak!"}
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default UserStreakPage;
