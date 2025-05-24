import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Calendar as CalendarIcon,
  Clock,
  Apple,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Utensils,
  Leaf,
  Beef,
  Wheat,
  Trash2,
} from "lucide-react";
import {
  createNewFoodLog,
  deleteFoodLog,
  getFoodLogDatesByMonth,
  getFoodLogsByDate,
} from "../../services/nutrition/nutritionService";
import { FoodLogFormData, foodLogSchema } from "../../schemas/foodLogSchema";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import axios from "axios";
import { IFoodLog, parsedFoodsData } from "../../types/nutrition.type";
import ConfirmModal from "../../components/shared/modal/ConfirmModal";
import { useToast } from "../../context/ToastContext";

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

const NutritionTrackingPage = () => {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(new Date().toLocaleDateString())
  );
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [serverError, setServerError] = useState("");
  const { showToast } = useToast();
  const userId = useSelector((state: RootState) => state.auth.user?.id || "");
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FoodLogFormData>({
    resolver: zodResolver(foodLogSchema),
    defaultValues: {
      mealType: "breakfast",
    },
  });

  // ------------------- Calendar functions
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

  const daysInMonth = useMemo(() => getDaysInMonth(selectedMonth), [selectedMonth]);

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
  
  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  //--------------------------

  
  // ------------- food logs of selected date
  const { data: foodLogs = [], isLoading } = useQuery({
    queryKey: ["foodLogs", selectedDate.toISOString()],
    queryFn: () => getFoodLogsByDate(selectedDate, userId),
  });
 
  // -------------- food logs uploaded dates by month
  const { data: foodLogDates } = useQuery({
    queryKey: ["foodLogDates", userId, selectedMonth],
    queryFn: () => getFoodLogDatesByMonth(selectedMonth, userId),
    staleTime: 5 * 60 * 1000,
  });

  
  // --------------- create new food log
  const mutation = useMutation({
    mutationFn: ({
      foodDescription,
      mealType,
      selectedDate,
    }: FoodLogFormData & { selectedDate: Date }) =>
      createNewFoodLog({ foodDescription, mealType, selectedDate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foodLogs"] });
      queryClient.invalidateQueries({ queryKey: ["foodLogDates"] });
      reset();
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data.message || "Failed to add Food logs !"
        );
      } else {
        setServerError("Failed to add Food logs !");
      }
    },
  });

  const onSubmit = (data: FoodLogFormData) => {
    setServerError("");
    mutation.mutate({ ...data, selectedDate });
  };

  // -------------- delete food log
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedFoodLogId, setSelectedFoodLogId] = useState("");

  const deleteFoodLogMutation = useMutation({
    mutationFn: deleteFoodLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foodLogs"] });
      queryClient.invalidateQueries({ queryKey: ["foodLogDates"] });
      showToast("success", "Food log deleted successfully!");
      setShowDeleteConfirm(false);
    },
    onError: (error) => {
      console.error("Failed to delete food log", error);
      showToast("error", "Failed to delete food log.");
      setShowDeleteConfirm(false);
    },
  });

  const handleDeleteFoodLog = (foodLogId: string) => {
    setShowDeleteConfirm(true);
    setSelectedFoodLogId(foodLogId);
  };
  const handleConfirmDelete = () => {
    deleteFoodLogMutation.mutate(selectedFoodLogId);
  };
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  //--------------------------------------

  //----------- calculate daily total nutrtions 
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

  //-------------------------------

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
          className="relative z-10 max-w-7xl mx-auto px-6 text-center"
        >
          <motion.h1
            variants={fadeIn}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Nutrition Tracking
          </motion.h1>
          <motion.div
            variants={fadeIn}
            className="w-20 h-1 bg-white/30 mx-auto mb-6 rounded-full"
          ></motion.div>
          <motion.p
            variants={fadeIn}
            className="text-white/80 max-w-2xl mx-auto"
          >
            Track your daily nutrition intake and maintain a healthy diet
          </motion.p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-16 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Calendar and Food Log Form */}
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
                                    ? "bg-gray-100 text-gray-400"
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

            {/* Add New Food Log */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <PlusCircle className="text-blue-600" size={24} />
                Add Food Log
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Food Description
                  </label>
                  <textarea
                    {...register("foodDescription")}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    rows={3}
                    placeholder="Enter what you ate (e.g., '2 slices whole wheat bread, 1 large egg, 1 cup black coffee')"
                  ></textarea>
                  {errors.foodDescription && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.foodDescription.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meal Type
                  </label>
                  <select
                    {...register("mealType")}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select meal type</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snacks">Snacks</option>
                  </select>
                  {errors.mealType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.mealType.message}
                    </p>
                  )}
                  {serverError && (
                    <p className="text-red-500 text-sm mt-1">{serverError}</p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={mutation.isPending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {mutation.isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Adding Food Log...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle size={20} />
                      <span>Add Food Log</span>
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Right Column - Nutrition Summary and Food Logs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            {/* Daily Nutrition Summary */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Apple className="text-green-600" size={24} />
                Nutrition Summary - {selectedDate.toLocaleDateString()}
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-yellow-100 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Utensils size={16} className="h-4 w-4 text-yellow-500" />
                    <span>Calories</span>
                  </div>
                  <p className="text-xl font-bold">
                    {dailyTotals.calories.toFixed(0)} kcal
                  </p>
                </div>

                <div className="p-4 bg-red-100 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Beef size={16} className="h-4 w-4 text-red-500" />
                    <span>Protein</span>
                  </div>
                  <p className="text-xl font-bold">
                    {dailyTotals.protein.toFixed(1)}g
                  </p>
                </div>

                <div className="p-4 bg-amber-100 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Wheat size={16} className="h-4 w-4 text-amber-500" />
                    <span>Carbs</span>
                  </div>
                  <p className="text-xl font-bold">
                    {dailyTotals.carbohydrates.toFixed(1)}g
                  </p>
                </div>

                <div className="p-4 bg-orange-100 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Utensils size={16} className="h-4 w-4 text-orange-500" />
                    <span>Fat</span>
                  </div>
                  <p className="text-xl font-bold">
                    {dailyTotals.fat.toFixed(1)}g
                  </p>
                </div>

                <div className="p-4 bg-green-100 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Leaf size={16} className="h-4 w-4 text-green-500" />
                    <span>Fiber</span>
                  </div>
                  <p className="text-xl font-bold">
                    {dailyTotals.fiber.toFixed(1)}g
                  </p>
                </div>
              </div>
            </div>

            {/* Food Logs List */}
            <div
              className="bg-white rounded-xl shadow-xl border border-gray-100 h-[41.6em] overflow-y-auto"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
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
                // food logs
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
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            handleDeleteFoodLog(log._id);
                          }}
                          disabled={deleteFoodLogMutation.isPending}
                          className=" p-1 text-blue-900 hover:text-black hover:bg-gray-300 rounded-full"
                        >
                          <Trash2 size={15} className="h-4 w-4 text-red-500" />
                        </motion.button>
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
                      <div className="flex  justify-evenly text-sm text-gray-600">
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
          </motion.div>
        </div>
      </div>
      <ConfirmModal
        type="warning"
        title="Confirm Deletion"
        message={`Are you sure you want to delete this food log? This action cannot be undone.`}
        confirmText="Delete"
        isOpen={showDeleteConfirm}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isConfirming={deleteFoodLogMutation.isPending}
      />
    </div>
  );
};

export default NutritionTrackingPage;
