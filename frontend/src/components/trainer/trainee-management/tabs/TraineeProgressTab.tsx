import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calculator, Dumbbell, Scale, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceArea,
  CartesianGrid,
} from "recharts";
import { getProgressionData } from "../../../../services/progress/progressService";
import { TraineeData } from "../../../../types/trainee.type";
import { Progress } from "../../../../types/progress.type";
import { BMI_CATEGORY_COLORS } from "../../../../constants/colors/bmi-category.colors";
import { getBMIClass } from "../../../../utils/getBmiClass";
import { BmiCustomTooltip } from "../../../shared/graph/BmiCustomToolTip";

interface TraineeProgressTabProps {
  traineeData: TraineeData;
}

const calculateWeightToNormalBmi = (currentWeight: number, height: number) => {
  const heightInMeters = height / 100;
  const minNormalWeight = 18.5 * heightInMeters ** 2;
  const maxNormalWeight = 24.9 * heightInMeters ** 2;

  if (currentWeight < minNormalWeight) {
    return `Needs to gain ${(minNormalWeight - currentWeight).toFixed(
      1
    )} kg to reach normal BMI.`;
  } else if (currentWeight > maxNormalWeight) {
    return `Needs to lose ${(currentWeight - maxNormalWeight).toFixed(
      1
    )} kg to reach normal BMI.`;
  } else {
    return "BMI is in the normal range.";
  }
};



const TraineeProgressTab = ({ traineeData }: TraineeProgressTabProps) => {
  const { data: progressions = [], isLoading } = useQuery<Progress[]>({
    queryKey: ["traineeProgressions", traineeData.traineeId],
    queryFn: () => getProgressionData(traineeData.traineeId),
    staleTime: 3000,
  });

  const latest =
    progressions.length > 0 ? progressions[progressions.length - 1] : null;
  const bmiAdvice = latest
    ? calculateWeightToNormalBmi(latest.weight, latest.height)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <h3 className="text-2xl font-semibold mb-4">
        Progress Overview for {traineeData.username}
      </h3>

      {isLoading ? (
        <p className="text-gray-500">Loading progression data...</p>
      ) : progressions.length === 0 ? (
        <div className="text-center text-gray-500">
          <Dumbbell className="w-16 h-16 mx-auto mb-4" />
          <p>No progression data available for this trainee yet.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Latest Statistics</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    getBMIClass(progressions[progressions.length - 1].bmi).color
                  }`}
                >
                  {getBMIClass(progressions[progressions.length - 1].bmi).class}
                </p>
              </div>
            </div>
            {bmiAdvice && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="mt-6 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm"
              >
                <p>{bmiAdvice}</p>
              </motion.div>
            )}

          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h4 className="text-lg font-medium mb-4">Progress Chart</h4>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={progressions}
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="createdAt"
                  tickFormatter={(tick) =>
                    new Date(tick).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  angle={270}
                  dy={20}
                  dx={-5}
                  fontSize={14}
                  fontStyle={"italic"}
                  stroke="#000"
                />
                <YAxis
                  yAxisId="bmiAxis"
                  domain={[10, 45]}
                  allowDataOverflow={true}
                  stroke="#000"
                  fontSize={14}
                  fontStyle={"italic"}
                  ticks={[0, 18.5, 25, 30, 45]}
                  label={{
                    value: "BMI",
                    angle: -90,
                    position: "insideLeft",
                    dx: 0,
                    style: {
                      textAnchor: "middle",
                      fill: "#666",
                      fontSize: "0.9em",
                    },
                  }}
                />
                <Tooltip
                  content={<BmiCustomTooltip />}
                  cursor={{
                    stroke: "rgba(150,150,150,0.5)",
                    strokeWidth: 1,
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{ paddingBottom: "10px" }}
                />
                {/* BMI Category Reference Areas - ensure yAxisId matches the YAxis for BMI */}
                <ReferenceArea
                  yAxisId="bmiAxis"
                  y1={10}
                  y2={18.5}
                  fill={BMI_CATEGORY_COLORS.Underweight}
                  label={{
                    position: "insideTopLeft",
                    value: "Underweight",
                    fill: "rgba(0,0,0,1)",
                    fontSize: 10,
                  }}
                  stroke="none"
                />
                <ReferenceArea
                  yAxisId="bmiAxis"
                  y1={18.5}
                  y2={25}
                  label={{
                    position: "insideTopLeft",
                    value: "Normal",
                    fill: "rgba(0,0,0,1)",
                    fontSize: 10,
                  }}
                  fill={BMI_CATEGORY_COLORS.Normal}
                  stroke="none"
                />
                <ReferenceArea
                  yAxisId="bmiAxis"
                  y1={25}
                  y2={30}
                  fill={BMI_CATEGORY_COLORS.Overweight}
                  label={{
                    position: "insideTopLeft",
                    value: "Overweight",
                    fill: "rgba(0,0,0,1)",
                    fontSize: 10,
                  }}
                  stroke="none"
                />
                <ReferenceArea
                  yAxisId="bmiAxis"
                  y1={30}
                  y2={45}
                  fill={BMI_CATEGORY_COLORS.Obese}
                  label={{
                    position: "insideTopLeft",
                    value: "Obese",
                    fill: "rgba(0,0,0,1)",
                    fontSize: 10,
                  }}
                  stroke="none"
                />
                {/* Single Line for BMI */}
                <Line
                  yAxisId="bmiAxis" // Ensure this matches the YAxis for BMI
                  type="monotone"
                  dataKey="bmi"
                  stroke="#8b5cf6" // Purple (or choose another color for BMI)
                  strokeWidth={2.5}
                  name="Body Mass Index (BMI)"
                  dot={{
                    r: 4,
                    strokeWidth: 1,
                    fill: "#8b5cf6",
                    stroke: "#fff",
                  }}
                  activeDot={{
                    r: 6,
                    strokeWidth: 2,
                    fill: "#8b5cf6",
                    stroke: "#fff",
                  }}
                  connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default TraineeProgressTab;
