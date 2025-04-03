import { Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUp,
  ArrowDown,
  Users,
  Dumbbell,
  // Activity,
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
  fetchMonthlyRegistrationData,
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
  { name: "Jan", users: 0, trainers: 0 },
  { name: "Feb", users: 0, trainers: 0 },
  { name: "Mar", users: 0, trainers: 0 },
];
const MetricCard = ({
  title,
  totalValue,
  currentMonthValue,
  change,
  icon: Icon,
}: {
  title: string;
  totalValue: string;
  currentMonthValue: string;
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
      <div className="text-2xl font-bold mb-1">{totalValue}</div>
      {currentMonthValue !== undefined && (
        <div className="text-sm text-gray-600 mb-1">
          This Month: {currentMonthValue}
        </div>
      )}
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
const HomeTrainer = () => {

  return (
    <div className="">
      <h1 className="text-2xl font-bold pl-20 mb-3 px-6 pt-4 ">DASHBOARD</h1>
      <div className="border-b-1 pt-2 mb-5"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 px-6 py-4">
        {/* Revenue Card */}
        <MetricCard
          title="Revenue"
          totalValue={"₹0"}
          currentMonthValue="₹0"
          change={0}
          icon={CreditCard}
        />

        {/* Refund Card */}
        <MetricCard
          title="Refund"
          totalValue={"₹0"}
          currentMonthValue="₹0"
          change={0}
          icon={RefreshCcw}
        />

        {/* Income Card */}
        <MetricCard
          title="Income"
          totalValue={"₹0"}
          currentMonthValue="₹0"
          change={0}
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
                  dataKey="trainees"
                  stroke="#2D31FA"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <MetricCard
            title="Total Subscriptions"
            totalValue={ "0"}
            currentMonthValue={ "0"}
            change={0}
            icon={Users}
          />
          <MetricCard
            title="Active Trainees"
            totalValue={"0"}
            currentMonthValue={ "0"}
            change={ 0}
            icon={Dumbbell}
          />
        </div>
      </div>
    </div>
  );
};

export default HomeTrainer;
