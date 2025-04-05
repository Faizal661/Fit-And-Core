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
import Skeleton from '@mui/material/Skeleton';

 
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
  isLoading,
  isError,
}: {
  title: string;
  totalValue: string;
  currentMonthValue: string;
  change: number;
  icon: LucideIcon;
  isLoading: boolean;
  isError: Error | null;
}) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col">
      <div className="text-sm text-gray-500 mb-1 flex items-center">
        {Icon && <Icon size={16} className="mr-2" />}
        {title}
      </div>
      {isError ? (
        <div className="text-red-600 text-xl font-semibold my-6">Failed to fetch data.</div> 
      ) : (
        <div>
          <div className="text-2xl font-bold mb-1">
            {isLoading ? (
              <Skeleton
                width={30}
                animation="wave"
              />
            ) : (
              totalValue
            )}
          </div>
          {currentMonthValue !== undefined && (
            <div className="text-sm text-gray-600 mb-1">
              This Month:{" "}
              {isLoading ? <Skeleton width={40} /> : currentMonthValue}
            </div>
          )}
          <div
            className={`text-xs ${
              isPositive ? "text-green-500" : "text-red-500"
            } flex items-center`}
          >
            {isLoading ? (
              <Skeleton width={150} />
            ) : (
              <>
                {isPositive ? (
                  <ArrowUp size={12} className="mr-1" />
                ) : (
                  <ArrowDown size={12} className="mr-1" />
                )}
                {Math.abs(change || 0)}% {isPositive ? "increase" : "decrease"}{" "}
                from last month
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
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
          isLoading={false}
          isError={null}
        />

        {/* Refund Card */}
        <MetricCard
          title="Refund"
          totalValue={"₹0"}
          currentMonthValue="₹0"
          change={0}
          icon={RefreshCcw}
          isLoading={false}
          isError={null}
        />

        {/* Income Card */}
        <MetricCard
          title="Income"
          totalValue={"₹0"}
          currentMonthValue="₹0"
          change={0}
          icon={CreditCard}
          isLoading={false}
          isError={null}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 py-4">
        {/* Chart */}

        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">New Registrations</h2>
          {isLoadingMonthly ? (
            <Skeleton height={300} variant="rounded" animation='wave' />
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={graphData?.monthlyData || subscriptionData}>
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
          )}
        </div>

        <div className="space-y-6">
          <MetricCard
            title="Total Users"
            totalValue={totalUserData?.totalCount}
            currentMonthValue={totalUserData?.currentMonthCount || "0"}
            change={totalUserData?.percentChange || 0}
            icon={Users}
            isLoading={isLoadingUsers}
            isError={userError}
          />
          <MetricCard
            title="Total Trainers"
            totalValue={totalTrainerData?.totalCount}
            currentMonthValue={totalTrainerData?.currentMonthCount || "0"}
            change={totalTrainerData?.percentChange || 0}
            icon={Dumbbell}
            isLoading={isLoadingTrainers}
            isError={trainerError}
          />
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
  );
};

export default AdminDashboard;
