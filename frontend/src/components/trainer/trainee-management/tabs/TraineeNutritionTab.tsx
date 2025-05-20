import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Calendar as CalendarIcon,
  Clock,
  Apple,
  ChevronLeft,
  ChevronRight,
  Utensils,
  Leaf,
  Beef,
  Wheat,
} from "lucide-react";
import { TraineeData } from "../../../../types/trainee.type";
import { IFoodLog, parsedFoodsData } from "../../../../types/nutrition.type";
import {
  getFoodLogDatesByMonth,
  getFoodLogsByDate,
} from "../../../../services/nutrition/nutritionService";

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

interface TraineeNutritionTabProps {
  traineeData: TraineeData;
}

const TraineeNutritionTab = ({ traineeData }: TraineeNutritionTabProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const daysInMonth = getDaysInMonth(selectedMonth);

  const isToday = (date: Date) => {
    const today = new Date();
    return date?.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date?.toDateString() === selectedDate.toDateString();
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Navigation functions
  const previousMonth = () => {
    setSelectedMonth(
      new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setSelectedMonth(
      new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1)
    );
  };

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType) {
      case "breakfast":
        return <Apple className="h-5 w-5 text-amber-500" />;
      case "lunch":
        return <Utensils className="h-5 w-5 text-blue-500" />;
      case "dinner":
        return <Utensils className="h-5 w-5 text-purple-500" />;
      case "snacks":
        return <Apple className="h-5 w-5 text-green-500" />;
      default:
        return <Utensils className="h-5 w-5 text-gray-500" />;
    }
  };

  const { data: foodLogs = [], isLoading } = useQuery({
    queryKey: [
      "trainee-foodLogs",
      traineeData.traineeId,
      selectedDate.toISOString(),
    ],
    queryFn: () => getFoodLogsByDate(selectedDate, traineeData.traineeId),
    enabled: !!traineeData.traineeId,
  });

  const { data: foodLogDates = [] } = useQuery({
    queryKey: [
      "trainee-foodLogDates",
      traineeData.traineeId,
      selectedMonth.getFullYear(),
      selectedMonth.getMonth(),
    ],
    queryFn: () => getFoodLogDatesByMonth(selectedMonth, traineeData.traineeId),
    enabled: !!traineeData.traineeId,
  });

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const calculateDailyTotals = (logs: IFoodLog[]) => {
    return logs?.reduce(
      (acc, log) => ({
        calories: (acc.calories || 0) + (log.nutrition?.calories || 0),
        protein: (acc.protein || 0) + (log.nutrition?.protein || 0),
        carbohydrates:
          (acc.carbohydrates || 0) + (log.nutrition?.carbohydrates || 0),
        fat: (acc.fat || 0) + (log.nutrition?.fat || 0),
        fiber: (acc.fiber || 0) + (log.nutrition?.fiber || 0),
      }),
      {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        fiber: 0,
      }
    );
  };

  const dailyTotals = calculateDailyTotals(foodLogs || []);

  return (
    <div className="min-h-screen pb-5 text-gray-800 overflow-hidden">
      {/* Hero Section */}
      <div className="relative py-16 bg-gradient-to-r from-blue-600/90 to-purple-600/90 rounded-xl mb-8">
        <div
          className="absolute inset-0 bg-black/10 z-0 opacity-30 rounded-xl"
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
          className="relative z-10 max-w-7xl mx-auto px-6 text-center"
        >
          <motion.h1
            variants={fadeIn}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            {traineeData.username}'s Nutrition
          </motion.h1>
          <motion.div
            variants={fadeIn}
            className="w-20 h-1 bg-white/30 mx-auto mb-6 rounded-full"
          ></motion.div>
          <motion.p
            variants={fadeIn}
            className="text-white/80 max-w-2xl mx-auto"
          >
            Track your trainee's nutrition intake and provide better guidance
          </motion.p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-5 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Calendar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Calendar */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <CalendarIcon className="text-blue-600" size={24} />
                  {selectedMonth.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={previousMonth}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextMonth}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronRight size={20} />
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-gray-500 py-2"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {daysInMonth.map((date, index) => {
                  const isLogged = date
                    ? foodLogDates?.includes(formatDate(date))
                    : false;

                  return (
                    <div key={index} className="aspect-square">
                      {date && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedDate(date)}
                          className={`w-full h-full rounded-lg flex items-center justify-center transition-all duration-300
                                ${
                                  isSelected(date)
                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                                    : isToday(date)
                                    ? "bg-blue-50 text-blue-600"
                                    : isPastDate(date)
                                    ? "bg-gray-100 text-gray-900"
                                    : "hover:bg-gray-100"
                                }
                                ${
                                  isLogged
                                    ? "border-2 border-green-500"
                                    : "border border-transparent"
                                }
                              `}
                        >
                          {date.getDate()}
                        </motion.button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Daily Nutrition Summary */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Apple className="text-green-600" size={24} />
                Nutrition Summary - {selectedDate.toLocaleDateString()}
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-yellow-100 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Utensils size={16} className="h-4 w-4 text-yellow-500"/>
                    <span>Calories</span>
                  </div>
                  <p className="text-xl font-bold">
                    {dailyTotals.calories.toFixed(0)} kcal
                  </p>
                </div>

                <div className="p-4 bg-red-100 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Beef size={16} className="h-4 w-4 text-red-500"/>
                    <span>Protein</span>
                  </div>
                  <p className="text-xl font-bold">
                    {dailyTotals.protein.toFixed(1)}g
                  </p>
                </div>

                <div className="p-4 bg-amber-100 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Wheat size={16} className="h-4 w-4 text-amber-500"/>
                    <span>Carbs</span>
                  </div>
                  <p className="text-xl font-bold">
                    {dailyTotals.carbohydrates.toFixed(1)}g
                  </p>
                </div>

                <div className="p-4 bg-orange-100 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Utensils size={16} className="h-4 w-4 text-orange-500"/>
                    <span>Fat</span>
                  </div>
                  <p className="text-xl font-bold">
                    {dailyTotals.fat.toFixed(1)}g
                  </p>
                </div>

                <div className="p-4 bg-green-100 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Leaf size={16} className="h-4 w-4 text-green-500"/>
                    <span>Fiber</span>
                  </div>
                  <p className="text-xl font-bold">
                    {dailyTotals.fiber.toFixed(1)}g
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Food Logs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Food Logs List */}
            <div
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              className="bg-white rounded-xl shadow-xl border border-gray-100  h-[29em] overflow-y-auto"
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 sticky top-0 bg-white px-8 pt-4 pb-4 shadow-md">
                <Clock className="text-purple-600" size={24} />
                Food Logs
              </h2>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading food logs...</p>
                </div>
              ) : foodLogs?.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <Utensils className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No food logs for this date</p>
                </div>
              ) : (
                <div className="space-y-4 px-8 pb-8">
                  {foodLogs?.map((log: any) => (
                    <motion.div
                      key={log._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getMealTypeIcon(log.mealType)}
                          <span className="font-medium capitalize">
                            {log.mealType}
                          </span>
                        </div>
                      </div>

                      {/* Parsed Foods List */}
                      <div className="mb-3">
                        {log.parsedFoods && log.parsedFoods.length > 0 ? (
                          <ul className="space-y-1">
                            {log.parsedFoods.map(
                              (food: parsedFoodsData, index: number) => (
                                <li
                                  key={index}
                                  className="text-sm text-gray-700"
                                >
                                  • {food.quantity} {food.name}
                                </li>
                              )
                            )}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-700">
                            {log.foodDescription}
                          </p>
                        )}
                      </div>

                      {/* Nutrition Information */}
                      <div className="flex justify-evenly text-sm text-gray-600">
                        <div className="flex flex-col items-center gap-1">
                          <Utensils className="h-4 w-4 text-orange-500" />
                          <span>
                            {log.nutrition?.calories?.toFixed(0) || 0} kcal
                          </span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <Beef className="h-4 w-4 text-red-500" />
                          <span>
                            {log.nutrition?.protein?.toFixed(1) || 0}g protein
                          </span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <Wheat className="h-4 w-4 text-amber-500" />
                          <span>
                            {log.nutrition?.carbohydrates?.toFixed(1) || 0}g
                            carbs
                          </span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <Leaf className="h-4 w-4 text-yellow-500" />
                          <span>
                            {log.nutrition?.fat?.toFixed(1) || 0}g fat
                          </span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <Apple className="h-4 w-4 text-green-500" />
                          <span>
                            {log.nutrition?.fiber?.toFixed(1) || 0}g fiber
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Nutrition Trends */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Apple className="text-blue-600" size={24} />
                Trainer Notes
              </h2>

              <div className="p-4 bg-gray-50 rounded-xl text-gray-600">
                <p className="mb-2">
                  Food logs for {traineeData.username} on{" "}
                  {selectedDate.toLocaleDateString()}:
                </p>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                  <li>Total meals logged: {foodLogs?.length || 0}</li>
                  <li>
                    Calorie target completion:{" "}
                    {dailyTotals.calories > 0
                      ? `${Math.min(
                          100,
                          Math.round((dailyTotals.calories / 2000) * 100)
                        )}%`
                      : "0%"}{" "}
                    ( 2000 kcal daily target)
                  </li>
                  <li>
                    Protein intake:{" "}
                    {dailyTotals.protein > 0
                      ? `${Math.min(
                          100,
                          Math.round((dailyTotals.protein / 150) * 100)
                        )}%`
                      : "0%"}{" "}
                    (of 150g)
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TraineeNutritionTab;
