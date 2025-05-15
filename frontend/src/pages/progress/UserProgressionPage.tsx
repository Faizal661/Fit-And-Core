import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceArea,
} from "recharts";
import {
  Scale,
  Ruler,
  Calculator,
  TrendingUp,
  Activity,
  ChevronRight,
} from "lucide-react";
import {
  getMyProgressionData,
  newProgression,
} from "../../services/progress/progressService";
import {
  ProgressionFormData,
  progressionSchema,
} from "../../schemas/progressSchema";
import { useToast } from "../../context/ToastContext";
import Footer from "../../components/shared/Footer";
import { Progress } from "../../types/progress.type";
import { BMI_CATEGORY_COLORS } from "../../constants/bmi-category.colors";

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

const UserProgressionPage = () => {
  const queryClient = useQueryClient();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { showToast } = useToast();
  const [showBmiChart, setShowBmiChart] = useState(false);
  const [bmiGuidance, setBmiGuidance] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProgressionFormData>({
    resolver: zodResolver(progressionSchema),
  });

  // Fetch progression data
  const { data: progressions, isLoading } = useQuery({
    queryKey: ["progressions"],
    queryFn: getMyProgressionData,
  });

  const mutation = useMutation({
    mutationFn: newProgression,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progressions"] });
      reset();
      showToast("success", "Progression added !");
    },
    onError: () => {
      showToast("error", "Failed to add progression !");
    },
  });

  const onSubmit = (data: ProgressionFormData) => {
    mutation.mutate(data);
  };

  const getBMIClass = (bmi: number) => {
    if (bmi < 18.5)
      return { class: "Underweight", color: "text-blue-600", range: "< 18.5" };
    if (bmi < 25)
      return { class: "Normal", color: "text-green-600", range: "18.5 - 24.9" };
    if (bmi < 30)
      return {
        class: "Overweight",
        color: "text-yellow-600",
        range: "25 - 29.9",
      };
    return { class: "Obese", color: "text-red-600", range: "≥ 30" };
  };

  const calculateWeightToNormalBmi = (latestProgression: Progress) => {
    if (
      !latestProgression ||
      !latestProgression.height ||
      !latestProgression.bmi
    ) {
      return "";
    }

    const currentWeight = parseFloat(latestProgression.weight);
    const currentHeightCm = parseFloat(latestProgression.height);
    const currentBmi = parseFloat(latestProgression.bmi);
    const heightM = currentHeightCm / 100;

    const NORMAL_BMI_LOWER = 18.5;
    const NORMAL_BMI_UPPER = 24.9;

    let guidance = "";

    if (currentBmi < NORMAL_BMI_LOWER) {
      const targetWeightMin = NORMAL_BMI_LOWER * (heightM * heightM);
      const weightToGain = targetWeightMin - currentWeight;
      if (weightToGain > 0.1) {
        guidance = `To reach a normal BMI (target ${NORMAL_BMI_LOWER}), you could aim to gain approximately ${weightToGain.toFixed(
          1
        )} kg.`;
      } else if (weightToGain < -0.1) {
        guidance =
          "Your weight seems higher than expected for your BMI. Please check your entries.";
      } else {
        guidance =
          "You are very close to the normal BMI range. Maintain a healthy lifestyle.";
      }
    } else if (currentBmi > NORMAL_BMI_UPPER) {
      const targetWeightMax = NORMAL_BMI_UPPER * (heightM * heightM);
      const weightToLose = currentWeight - targetWeightMax;
      if (weightToLose > 0.1) {
        guidance = `To reach a normal BMI (target ${NORMAL_BMI_UPPER}), you could aim to lose approximately ${weightToLose.toFixed(
          1
        )} kg.`;
      } else if (weightToLose < -0.1) {
        guidance =
          "Your weight seems lower than expected for your BMI. Please check your entries.";
      } else {
        guidance =
          "You are very close to the normal BMI range. Maintain a healthy lifestyle.";
      }
    } else {
      guidance = "You are in the normal BMI range. Well done!";
    }
    return guidance;
  };

    useEffect(() => { 
      if (progressions && progressions.length > 0) {
        const latestProgression = progressions[progressions.length - 1];
        setBmiGuidance(calculateWeightToNormalBmi(latestProgression));
      } else {
        setBmiGuidance("");
      }
    }, [progressions]); 
  

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
          <motion.h1
            variants={fadeIn}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Track Your Progress
          </motion.h1>
          <motion.div
            variants={fadeIn}
            className="w-20 h-1 bg-white/30 mx-auto mb-6 rounded-full"
          ></motion.div>
          <motion.p
            variants={fadeIn}
            className="text-white/80 max-w-2xl mx-auto"
          >
            Monitor your fitness journey and track your improvements over time
          </motion.p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 -mt-16 mb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-xl border border-gray-100 p-8"
          >
            <h2 className="text-2xl font-bold mb-6">Enter New Measurements</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Ruler size={18} />
                  Height (cm)
                </label>
                <input
                  type="number"
                  {...register("height", { valueAsNumber: true })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your height in centimeters"
                />
                {errors.height && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.height.message}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Scale size={18} />
                  Weight (kg)
                </label>
                <input
                  type="number"
                  {...register("weight", { valueAsNumber: true })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your weight in kilograms"
                />
                {errors.weight && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.weight.message}
                  </p>
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
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Activity size={20} />
                    <span>Save Progress</span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Latest Stats */}
            {progressions && progressions.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Latest Statistics</h3>
                  <button
                    onClick={() => setShowBmiChart(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                  >
                    View BMI Categories <ChevronRight size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Weight, BMI, BMI Category divs remain the same */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <Scale size={16} />
                      <span>Weight</span>
                    </div>
                    <p className="text-xl font-bold">
                      {progressions[progressions.length - 1].weight} kg
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <Calculator size={16} />
                      <span>BMI</span>
                    </div>
                    <p className="text-xl font-bold">
                      {progressions[progressions.length - 1].bmi}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <TrendingUp size={16} />
                      <span>BMI category</span>
                    </div>
                    <p
                      className={`text-xl font-bold ${
                        getBMIClass(progressions[progressions.length - 1].bmi)
                          .color
                      }`}
                    >
                      {
                        getBMIClass(progressions[progressions.length - 1].bmi)
                          .class
                      }
                    </p>
                  </div>
                </div>
                {bmiGuidance && ( 
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="mt-6 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm"
                  >
                    <p>{bmiGuidance}</p>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>

          {/* Progress Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-xl border border-gray-100 p-8"
          >
            <h2 className="text-2xl font-bold mb-6">Progress Overview</h2>

            {isLoading ? (
              <div className="flex items-center justify-center h-[400px]">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : progressions && progressions.length > 0 ? (
              <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={progressions}
                      margin={{ top: 5, right: 30, left: 20, bottom: 20 }} // Increased bottom margin for labels if any
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" domain={['dataMin - 5', 'dataMax + 5']} /> {/* Domain for Weight */}
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={[10, 45]} // Adjusted domain for BMI to show all categories
                        label={{ // Optional: Label for BMI axis
                            value: 'BMI',
                            angle: 0,
                            position: 'insideRight',
                            dy: 70, // Adjust dy to position label correctly
                            style: { textAnchor: 'middle', fill: '#666' },
                        }}
                      />
                      <Tooltip />
                      <Legend verticalAlign="top" height={36}/>

                      {/* BMI Category Reference Areas */}
                      <ReferenceArea
                        yAxisId="right"
                        y1={10} // Start from the bottom of the defined domain or a low BMI value
                        y2={18.5}
                        fill={BMI_CATEGORY_COLORS.Underweight}
                        stroke={BMI_CATEGORY_COLORS.Underweight} // Optional: border for the area
                        strokeOpacity={0.5}
                        label={{ // Optional: Label for the area
                          position: 'insideTopRight',
                          value: 'Underweight',
                          fill: '#555', // Darker text for readability
                          fontSize: 10,
                          offset: 5, //
                        }}
                      />
                      <ReferenceArea
                        yAxisId="right"
                        y1={18.5}
                        y2={25}
                        fill={BMI_CATEGORY_COLORS.Normal}
                        stroke={BMI_CATEGORY_COLORS.Normal}
                        strokeOpacity={0.5}
                        label={{
                          position: 'insideTopRight',
                          value: 'Normal',
                          fill: '#555',
                          fontSize: 10,
                          offset: 5,
                        }}
                      />
                      <ReferenceArea
                        yAxisId="right"
                        y1={25}
                        y2={30}
                        fill={BMI_CATEGORY_COLORS.Overweight}
                        stroke={BMI_CATEGORY_COLORS.Overweight}
                        strokeOpacity={0.5}
                        label={{
                          position: 'insideTopRight',
                          value: 'Overweight',
                          fill: '#555',
                          fontSize: 10,
                          offset: 5,
                        }}
                      />
                      <ReferenceArea
                        yAxisId="right"
                        y1={30}
                        y2={45} // Extend to the top of the defined domain or a high BMI value
                        fill={BMI_CATEGORY_COLORS.Obese}
                        stroke={BMI_CATEGORY_COLORS.Obese}
                        strokeOpacity={0.5}
                        label={{
                          position: 'insideTopRight',
                          value: 'Obese',
                          fill: '#555',
                          fontSize: 10,
                          offset: 5,
                        }}
                      />

                      {/* Lines should be drawn on top of ReferenceAreas */}
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="weight"
                        stroke="#3b82f6" // Blue
                        name="Weight (kg)"
                        strokeWidth={2.5} // Slightly thicker line
                        dot={{ r: 3, strokeWidth: 1, fill: "#3b82f6" }}
                        activeDot={{ r: 5, strokeWidth: 1 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="bmi"
                        stroke="#8b5cf6" // Purple
                        name="BMI"
                        strokeWidth={2.5} // Slightly thicker line
                        dot={{ r: 3, strokeWidth: 1, fill: "#8b5cf6" }}
                        activeDot={{ r: 5, strokeWidth: 1 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
                <Activity size={48} className="mb-4" />
                <p className="text-lg">No progression data available yet</p>
                <p className="text-sm">
                  Start tracking your progress by adding your measurements
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      
      {showBmiChart && ( 
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowBmiChart(false)} 
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                BMI Categories
              </h3>
              <button
                onClick={() => setShowBmiChart(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close BMI categories chart"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-7 h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {[
                { bmi: 18.4, label: "Underweight" },
                { bmi: 22, label: "Normal Weight" },
                { bmi: 27, label: "Overweight" },
                { bmi: 35, label: "Obese" },
              ].map((category) => {
                const {
                  class: bmiClass,
                  color,
                  range,
                } = getBMIClass(category.bmi);
                return (
                  <div
                    key={category.label}
                    className={`p-4 rounded-lg border ${color
                      .replace("text-", "border-")
                      .replace("-600", "-400")} ${color
                      .replace("text-", "bg-")
                      .replace("-600", "-50")}`}
                  >
                    <h4 className={`text-lg font-semibold ${color}`}>
                      {bmiClass}
                    </h4>
                    <p className={`text-sm ${color.replace("-600", "-700")}`}>
                      BMI: {range}
                    </p>
                  </div>
                );
              })}
            </div>
            <p className="mt-6 text-xs text-gray-500 text-center">
              BMI is a general indicator and may not be accurate for all body
              types (e.g., athletes). Consult a healthcare professional for
              personalized advice.
            </p>
          </motion.div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
};

export default UserProgressionPage;
