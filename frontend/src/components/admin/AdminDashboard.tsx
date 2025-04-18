import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Dumbbell,
  CreditCard,
  RefreshCcw,
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
import { MetricCard } from "../shared/MetricCard";

 
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
    <div className="bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-normal px-8 ps-16 pt-5 pb-4">Dashboard</h1>
      <div className="border-b border-gray-100 mb-6"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-8 mb-8">
        {/* Revenue Card */}
        <div className="bg-white border border-gray-50">
          <MetricCard
            title="Revenue"
            totalValue={"₹0"}
            currentMonthValue="₹0"
            change={0}
            icon={CreditCard}
            isLoading={false}
            isError={null}
          />
        </div>

        {/* Refund Card */}
        <div className="bg-white border border-gray-50">
          <MetricCard
            title="Refund"
            totalValue={"₹0"}
            currentMonthValue="₹0"
            change={0}
            icon={RefreshCcw}
            isLoading={false}
            isError={null}
          />
        </div>

        {/* Income Card */}
        <div className="bg-white border border-gray-50">
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
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white border-1 p-6">
          <h2 className="text-sm font-medium mb-6 text-gray-700 ">New Registrations</h2>
          {isLoadingMonthly ? (
            <Skeleton height={280} variant="rectangular" animation="wave" />
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={graphData?.monthlyData || subscriptionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11}} />
                  <Tooltip contentStyle={{borderRadius: 0, boxShadow: 'none', border: '1px solid #f0f0f0'}} />
                  <Legend iconType="circle" iconSize={8} />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#333" 
                    strokeWidth={1.5}
                    dot={{r: 0}}
                    activeDot={{ r: 4 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="trainers" 
                    stroke="#888" 
                    strokeWidth={1.5}
                    dot={{r: 0}}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

          <div className="space-y-4">
          <div className="bg-white border border-gray-50">
            <MetricCard
              title="Total Users"
              totalValue={totalUserData?.totalCount}
              currentMonthValue={totalUserData?.currentMonthCount || "0"}
              change={totalUserData?.percentChange || 0}
              icon={Users}
              isLoading={isLoadingUsers}
              isError={userError}
            />
          </div>
          <div className="bg-white border border-gray-50">
            <MetricCard
              title="Total Trainers"
              totalValue={totalTrainerData?.totalCount}
              currentMonthValue={totalTrainerData?.currentMonthCount || "0"}
              change={totalTrainerData?.percentChange || 0}
              icon={Dumbbell}
              isLoading={isLoadingTrainers}
              isError={trainerError}
            />
          </div>
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
