import { Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Dumbbell,
  // Activity,
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
import Footer from "../../components/shared/Footer";
import { MetricCard } from "../../components/shared/MetricCard";

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
        <div className="lg:col-span-2 bg-white border-1 shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">Subscriptions</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={subscriptionData}>
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
        </div>

        <div className="space-y-6">
          <MetricCard
            title="Total Subscriptions"
            totalValue={ "0"}
            currentMonthValue={ "0"}
            change={0}
            icon={Users}
            isLoading={false}
            isError={null}
          />
          <MetricCard
            title="Active Trainees"
            totalValue={"0"}
            currentMonthValue={ "0"}
            change={ 0}
            icon={Dumbbell}
            isLoading={false}
            isError={null}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomeTrainer;
