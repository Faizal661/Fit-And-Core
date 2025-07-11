import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Calendar,
  Download,
  BarChart3,
  Activity,
} from "lucide-react";
import { RootState } from "../../redux/store";
import Footer from "../../components/shared/footer";
import { fetchFinanceData } from "../../services/admin/financeManagement";
import { useToast } from "../../context/ToastContext";
import { exportFinanceReport } from "../../utils/financeReportDownload";

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

export interface FinanceData {
  totalRevenue: number;
  totalRefunds: number;
  netIncome: number;
  monthlyGrowth: number;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    refunds: number;
    netIncome: number;
  }>;
}

const FinanceManagementPage = () => {
  const userRole = useSelector((state: RootState) => state.auth.user?.role);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [chartType, setChartType] = useState<"line" | "bar">("bar");
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { showToast } = useToast();

  // Fetch finance data
  const {
    data: financeData,
    isLoading,
    refetch,
  } = useQuery<FinanceData>({
    queryKey: ["financeData", dateRange],
    queryFn: () => fetchFinanceData(dateRange.startDate, dateRange.endDate),
  });

  const sampleFinanceData: FinanceData = {
    totalRevenue: 0.0,
    totalRefunds: 0.0,
    netIncome: 0.0,
    monthlyGrowth: 0.0,
    revenueByMonth: [
      { month: "Jan", revenue: 0, refunds: 0, netIncome: 0 },
      { month: "Feb", revenue: 0, refunds: 0, netIncome: 0 },
      { month: "Mar", revenue: 0, refunds: 0, netIncome: 0 },
      { month: "Apr", revenue: 0, refunds: 0, netIncome: 0 },
      { month: "May", revenue: 0, refunds: 0, netIncome: 0 },
      { month: "Jun", revenue: 0, refunds: 0, netIncome: 0 },
    ],
  };

  const revenueVsRefundData = [
    {
      label: "Total Revenue",
      value: financeData?.totalRevenue || 0,
      color: "#3b82f6",
    },
    {
      label: "Total Refunds",
      value: financeData?.totalRefunds || 0,
      color: "#ef4444",
    },
  ];

  const displayData = financeData || sampleFinanceData;

  const handleDateRangeChange = (
    field: "startDate" | "endDate",
    value: string
  ) => {
    setDateRange((prev) => ({ ...prev, [field]: value }));
  };

  const handleExportFinanceReport = () => {
    if (!displayData) {
      showToast("error", "No finance data available to export.");
      return;
    }
    exportFinanceReport(displayData);
    showToast("success", "Finance data downloaded");
  };

  const refreshData = () => {
    refetch();
  };

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
          <motion.div
            variants={fadeIn}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <DollarSign size={32} className="text-white" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Finance Management
            </h1>
          </motion.div>
          <motion.div
            variants={fadeIn}
            className="w-20 h-1 bg-white/30 mx-auto mb-6 rounded-full"
          ></motion.div>
          <motion.p
            variants={fadeIn}
            className="text-white/80 max-w-2xl mx-auto"
          >
            {userRole === "admin"
              ? "Monitor platform-wide financial performance"
              : "Track your training business revenue and growth"}
          </motion.p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-10 mb-16">
        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="text-blue-600" size={24} />
              <h2 className="text-xl font-bold">Financial Analytics</h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Date Range */}
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    handleDateRangeChange("startDate", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    handleDateRangeChange("endDate", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* Chart Type Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setChartType("line")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    chartType === "line"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  <Activity size={16} />
                  Line
                </button>
                <button
                  onClick={() => setChartType("bar")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    chartType === "bar"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  <BarChart3 size={16} />
                  Bar
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={refreshData}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <RefreshCw size={18} />
                  Refresh
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExportFinanceReport}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download size={18} />
                  Export
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Finance Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {/* Total Revenue */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="text-white" size={24} />
              </div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Total Revenue
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                ₹{displayData.totalRevenue}
              </p>
            </div>
          </div>

          {/* Total Refunds */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                <TrendingDown className="text-white" size={24} />
              </div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Total Refunds
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                ₹{displayData.totalRefunds}
              </p>
            </div>
          </div>

          {/* Net Income */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="text-white" size={24} />
              </div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Net Income
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                ₹{displayData.netIncome}
              </p>
            </div>
          </div>

          {/* Monthly Growth */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mb-4">
                <Activity className="text-white" size={24} />
              </div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Monthly Growth
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {displayData.monthlyGrowth}%
              </p>
            </div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Trend Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-xl border border-gray-100 p-8"
          >
            <h3 className="text-xl font-bold mb-6">Revenue Trend</h3>
            {isLoading ? (
              <div className="flex items-center justify-center h-80">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div style={{ width: "100%", height: 320 }}>
                <ResponsiveContainer>
                  {chartType === "line" ? (
                    <LineChart data={displayData.revenueByMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [
                          `₹${value.toLocaleString()}`,
                          "",
                        ]}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        name="Revenue"
                        strokeWidth={3}
                      />
                      <Line
                        type="monotone"
                        dataKey="refunds"
                        stroke="#ef4444"
                        name="Refunds"
                        strokeWidth={3}
                      />
                      <Line
                        type="monotone"
                        dataKey="netIncome"
                        stroke="#10b981"
                        name="Net Income"
                        strokeWidth={3}
                      />
                    </LineChart>
                  ) : (
                    <BarChart data={displayData.revenueByMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [
                          `₹${value.toLocaleString()}`,
                          "",
                        ]}
                      />
                      <Legend />
                      <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                      <Bar dataKey="refunds" fill="#ef4444" name="Refunds" />
                      <Bar
                        dataKey="netIncome"
                        fill="#10b981"
                        name="Net Income"
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>

          {/* Revenue by Category */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-xl border border-gray-100 p-8"
          >
            <h3 className="text-xl font-bold mb-6">Revenue vs Refunds</h3>
            {isLoading ? (
              <div className="flex items-center justify-center h-80">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div style={{ width: "100%", height: 320 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={revenueVsRefundData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ label, percent }) =>
                        `${label} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {revenueVsRefundData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        `₹${value.toLocaleString()}`,
                        "Amount",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FinanceManagementPage;
