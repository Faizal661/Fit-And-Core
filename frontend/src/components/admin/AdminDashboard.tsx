import { useQuery } from "@tanstack/react-query";
import {
  ArrowUp,
  ArrowDown,
  Users,
  Dumbbell,
  Activity,
  CreditCard,
  RefreshCcw,
  LucideIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  fetchUserCount,
  fetchTrainerCount,
} from "../../services/admin/adminDashboard";

const subscriptionData = [
  { name: "Apr", users: 0, trainers: 0 },
  { name: "May", users: 0, trainers: 0 },
  { name: "Jun", users: 0, trainers: 0 },
  { name: "Jul", users: 0, trainers: 0 },
  { name: "Aug", users: 0, trainers: 0 },
  { name: "Sep", users: 0, trainers: 0 },
  { name: "Oct", users: 0, trainers: 0 },
  { name: "Nov", users: 0, trainers: 0 },
  { name: "Dec", users: 0, trainers: 0 },
  { name: "Jan", users: 2, trainers: 1 },
  { name: "Feb", users: 4, trainers: 1 },
  { name: "Mar", users: 9, trainers: 4 },
];

const MetricCard = ({
  title,
  value,
  change,
  icon: Icon,
}: {
  title: string;
  value: string;
  change: number;
  icon: LucideIcon;
}) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col">
      <div className="text-sm text-gray-500 mb-1 flex items-center">
        {Icon && <Icon size={16} className="mr-2" />}
        {title}
      </div>
      <div className="text-2xl font-bold mb-2">{value}</div>
      <div
        className={`text-xs ${
          isPositive ? "text-green-500" : "text-red-500"
        } flex items-center`}
      >
        {isPositive ? (
          <ArrowUp size={12} className="mr-1" />
        ) : (
          <ArrowDown size={12} className="mr-1" />
        )}
        {Math.abs(change)}% {isPositive ? "increase" : "decrease"} from last
        month
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const {
    data: userData,
    isLoading: isLoadingUsers,
    error: userError,
  } = useQuery({
    queryKey: ["userCount"],
    queryFn: fetchUserCount,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: trainerData,
    isLoading: isLoadingTrainers,
    error: trainerError,
  } = useQuery({
    queryKey: ["trainerCount"],
    queryFn: fetchTrainerCount,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoadingUsers || isLoadingTrainers) {
    return (
      <>
        <h1 className="text-2xl font-bold pl-20 mb-3 px-6 pt-4 ">DASHBOARD</h1>
        <div className="border-b-1 pt-2 mb-5"></div>
        <div className="h-96  flex justify-center items-center text-4xl font-bold">
          <div className="text-center ">
            <span className="ml-2">Loading dashboard data...</span>
          </div>
        </div>
      </>
    );
  }

  if (userError || trainerError) {
    return (
      <>
        <h1 className="text-2xl font-bold pl-20 mb-3 px-6 pt-4 ">DASHBOARD</h1>
        <div className="border-b-1 pt-2 mb-5"></div>
        <div className="h-60  flex justify-center items-center text-4xl text-red-700 font-bold">
          <div className="text-center ">
            <span className="ml-2">
              Failed to load dashboard data. Please try again later.
            </span>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="">
      <h1 className="text-2xl font-bold pl-20 mb-3 px-6 pt-4 ">DASHBOARD</h1>
      <div className="border-b-1 pt-2 mb-5"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 px-6 py-4">
        {/* Revenue Card */}
        <MetricCard
          title="Revenue"
          value="₹5,490"
          change={7.5}
          icon={CreditCard}
        />

        {/* Refund Card */}
        <MetricCard
          title="Refund"
          value="₹640"
          change={-2.3}
          icon={RefreshCcw}
        />

        {/* Income Card */}
        <MetricCard
          title="Income"
          value="₹4,850"
          change={5.8}
          icon={CreditCard}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 py-4">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">Subscriptions</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={subscriptionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#2D31FA"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="trainers"
                  stroke="#51C1CB"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <MetricCard
            title="Total Users"
            value={userData?.count || "0"}
            change={userData?.percentChange || 0}
            icon={Users}
          />
          <MetricCard
            title="Total Trainers"
            value={trainerData?.count || "0"}
            change={trainerData?.percentChange || 0}
            icon={Dumbbell}
          />
          <MetricCard
            title="Active Users"
            value={"0"}
            change={0}
            icon={Activity}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
