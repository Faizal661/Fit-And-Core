import { useQuery } from "@tanstack/react-query";
import { Users, Dumbbell, CreditCard, RefreshCcw } from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  BarChart,
  Cell,
} from "recharts";
import {
  fetchUserCount,
  fetchTrainerCount,
  fetchMonthlyRegistrationData,
} from "../../services/admin/adminDashboard";
import Skeleton from "@mui/material/Skeleton";
import { MetricCard } from "../shared/MetricCard";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
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

const subscriptionData = [
  { name: "Jan", users: 0, trainers: 0 },
  { name: "Feb", users: 0, trainers: 0 },
  { name: "Mar", users: 0, trainers: 0 },
  { name: "Apr", users: 0, trainers: 0 },
  { name: "May", users: 0, trainers: 0 },
  { name: "Jun", users: 0, trainers: 0 },
  { name: "Jul", users: 0, trainers: 0 },
  { name: "Aug", users: 0, trainers: 0 },
  { name: "Sep", users: 0, trainers: 0 },
  { name: "Oct", users: 0, trainers: 0 },
  { name: "Nov", users: 0, trainers: 0 },
  { name: "Dec", users: 0, trainers: 0 },
];

const userColors = [
  "#ff4500",
  "#ff6347",
  "#ff7f50",
  "#ff8c00",
  "#ffa500",
  "#ffb20f",
];

const trainerColors = [
  "#0077be",
  "#0096c7",
  "#48cae4",
  "#90e0ef",
  "#ade8f4",
  "#caf0f8",
];
interface TooltipPayloadEntry {
  color: string;
  dataKey: string; 
  name: string;
  value: number; 
}
interface CustomTooltipProps {
  active?: boolean; 
  payload?: TooltipPayloadEntry[]; 
  label?: string | number; 
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded shadow-lg border border-gray-100">
        <p className="text-gray-700 font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p
            key={index}
            className="flex items-center text-sm my-1"
            style={{ color: entry.color }}
          >
            <span
              className="inline-block w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            ></span>
            <span className="font-medium mr-1">
              {entry.dataKey === "ratio"
                ? "User-Trainer Ratio:"
                : `${entry.name}:`}
            </span>
            <span>
              {entry.dataKey === "ratio" ? entry.value.toFixed(2) : entry.value}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const {
    data: totalUserData,
    isLoading: isLoadingUsers,
    error: userError,
  } = useQuery({
    queryKey: ["userCount"],
    queryFn: fetchUserCount,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: totalTrainerData,
    isLoading: isLoadingTrainers,
    error: trainerError,
  } = useQuery({
    queryKey: ["trainerCount"],
    queryFn: fetchTrainerCount,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: graphData,
    isLoading: isLoadingMonthly,
    // error: monthlyError,
  } = useQuery({
    queryKey: ["monthlyRegistrations"],
    queryFn: fetchMonthlyRegistrationData,
    staleTime: 5 * 60 * 1000,
  });

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      className="min-h-screen  bg-gray-50 text-gray-800 overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >

      {/* Hero section */}
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
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Dashboard
          </motion.h1>
          <motion.div
            variants={fadeIn}
            className="w-20 h-1 bg-white/30 mx-auto mb-6 rounded-full"
          ></motion.div>
        </motion.div>
      </div>

      {/* main content */}
      <div className="relative max-w-7xl mx-auto px-4 -mt-16 sm:px-6 lg:px-8 py-6 min-h-screen  z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {/* Revenue Card */}
          <motion.div
            variants={fadeIn}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <MetricCard
              title="Revenue"
              totalValue={"₹0"}
              currentMonthValue="₹0"
              change={0}
              icon={CreditCard}
              isLoading={false}
              isError={null}
            />
          </motion.div>

          {/* Refund Card */}
          <motion.div
            variants={fadeIn}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <MetricCard
              title="Refund"
              totalValue={"₹0"}
              currentMonthValue="₹0"
              change={0}
              icon={RefreshCcw}
              isLoading={false}
              isError={null}
            />
          </motion.div>

          {/* Income Card */}
          <motion.div
            variants={fadeIn}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <MetricCard
              title="Income"
              totalValue={"₹0"}
              currentMonthValue="₹0"
              change={0}
              icon={CreditCard}
              isLoading={false}
              isError={null}
            />
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <motion.div
            variants={fadeIn}
            className="lg:col-span-2 bg-white rounded-lg shadow-lg border border-gray-100 hover:shadow-xl p-6"
          >
            <h2 className="text-lg font-medium mb-4 text-gray-700">
              New Registrations
            </h2>
            {isLoadingMonthly ? (
              <Skeleton height={280} variant="rectangular" animation="wave" />
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={graphData?.monthlyData || subscriptionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    barGap={8}
                    barCategoryGap={16}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f0f0f0"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      dy={10}
                    />

                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                      width={40}
                    />

                    <Tooltip content={<CustomTooltip />} />

                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ paddingTop: 10 }}
                    />

                    <Bar
                      dataKey="users"
                      name="Users"
                      barSize={24}
                      radius={[4, 4, 0, 0]}
                      fill="#ff8c00"
                    >
                      {graphData?.monthlyData.map(
                        (
                          _entry: {
                            name: string;
                            users: number;
                            trainers: number;
                          },
                          index: number
                        ) => (
                          <Cell
                            key={`cell-user-${index}`}
                            fill={userColors[index % userColors.length]}
                          />
                        )
                      )}
                    </Bar>

                    <Bar
                      dataKey="trainers"
                      name="Trainers"
                      barSize={24}
                      radius={[4, 4, 0, 0]}
                      fill="#48cae4"
                    >
                      {graphData?.monthlyData.map(
                        (
                          _entry: {
                            name: string;
                            users: number;
                            trainers: number;
                          },
                          index: number
                        ) => (
                          <Cell
                            key={`cell-trainer-${index}`}
                            fill={trainerColors[index % trainerColors.length]}
                          />
                        )
                      )}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>

          <div className="space-y-6">
            <motion.div
              variants={fadeIn}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <MetricCard
                title="Total Users"
                totalValue={totalUserData?.totalCount}
                currentMonthValue={totalUserData?.currentMonthCount || "0"}
                change={totalUserData?.percentChange || 0}
                icon={Users}
                isLoading={isLoadingUsers}
                isError={userError}
              />
            </motion.div>
            <motion.div
              variants={fadeIn}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <MetricCard
                title="Total Trainers"
                totalValue={totalTrainerData?.totalCount}
                currentMonthValue={totalTrainerData?.currentMonthCount || "0"}
                change={totalTrainerData?.percentChange || 0}
                icon={Dumbbell}
                isLoading={isLoadingTrainers}
                isError={trainerError}
              />
            </motion.div>
            {/* <MetricCard
            title="Active Users"
            totalValue={activeUserData?.totalCount || "0"} // Assuming you'll implement total active users
            currentMonthValue={activeUserData?.currentMonthCount || "0"} // Assuming you'll implement monthly active users
            change={activeUserData?.percentChange || 0}
            icon={Activity}
          />*/}
            {/* <MetricCard
            title="Active Users"
            totalValue={"0"}
            currentMonthValue={"0"}
            change={0}
            icon={Activity}
          /> */}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
