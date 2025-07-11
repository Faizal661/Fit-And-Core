import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Wallet,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  ArrowUpCircle,
  ArrowDownCircle,
  Eye
} from 'lucide-react';
import { fetchWalletData } from '../../services/wallet/walletService';
import { formatDateAndTime } from '../../utils/dateFormat';

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

interface Transaction {
  _id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  category: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
  referenceId?: string;
}

interface WalletData {
  balance: number;
  totalCredits: number;
  totalDebits: number;
  transactions: Transaction[];
  totalTransactions: number;
}

type TransactionFilter = 'all' | 'credit' | 'debit';

const WalletPage = () => {
  const [activeTab, setActiveTab] = useState<TransactionFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const limit = 10;

  // Fetch wallet data
  const { data: walletData, isLoading } = useQuery<WalletData>({
    queryKey: ['walletData', activeTab, currentPage, dateRange, limit],
    queryFn:  () => fetchWalletData(currentPage,limit,activeTab,dateRange.startDate, dateRange.endDate),
  });
      

  // Sample data for demonstration
  const sampleWalletData: WalletData = {
    balance: 0,
    totalCredits: 0,
    totalDebits:  0,
    totalTransactions: 0,
    transactions: []
  };

  const displayData = walletData || sampleWalletData;
  const totalPages = Math.ceil((displayData.totalTransactions || 0) / limit);

  const getTransactionIcon = (type: string) => {
    return type === 'credit' ? (
      <ArrowUpCircle className="text-green-600" size={20} />
    ) : (
      <ArrowDownCircle className="text-red-600" size={20} />
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };


  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 overflow-hidden">
      {/* Hero Section */}
      <div className="relative py-24 bg-gradient-to-r from-blue-600/90 to-purple-600/90">
        <div className="absolute inset-0 bg-black/10 z-0 opacity-30"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>
        
        <motion.div 
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        >
          <motion.div variants={fadeIn} className="flex items-center justify-center gap-3 mb-6">
            <Wallet size={32} className="text-white" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              My Wallet
            </h1>
          </motion.div>
          <motion.div variants={fadeIn} className="w-20 h-1 bg-white/30 mx-auto mb-6 rounded-full"></motion.div>
          <motion.p variants={fadeIn} className="text-white/80 max-w-2xl mx-auto">
            Manage your finances and track all transactions
          </motion.p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-10">
        {/* Wallet Balance Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {/* Current Balance */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="text-white" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Current Balance</h3>
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                ₹{displayData.balance.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Total Credits */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-white" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Credits</h3>
              <p className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                ₹{displayData.totalCredits.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Total Debits */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-full -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingDown className="text-white" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Debits</h3>
              <p className="text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                ₹{displayData.totalDebits.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Transactions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 mb-16"
        >
          {/* Header with Filters */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <CreditCard className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold">Transaction History</h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Date Range Filters */}
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>

             
            </div>
          </div>

          {/* Transaction Type Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
            {(['all', 'credit', 'debit'] as TransactionFilter[]).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab === 'all' && <Eye size={16} />}
                {tab === 'credit' && <ArrowUpCircle size={16} />}
                {tab === 'debit' && <ArrowDownCircle size={16} />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Transactions
              </button>
            ))}
          </div>

          {/* Transactions List */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading transactions...</p>
            </div>
          // ) : error ? (
          //   <div className="text-center py-12 bg-red-50 rounded-xl">
          //     <CreditCard size={48} className="text-red-500 mx-auto mb-4" />
          //     <p className="text-red-600">Failed to load transactions</p>
          //   </div>
          ) : displayData.transactions.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <CreditCard size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No transactions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayData.transactions.map((transaction) => (
                <motion.div
                  key={transaction._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {transaction.description}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{transaction.category}</span>
                          <span>•</span>
                          <span>{formatDateAndTime(transaction.createdAt)}</span>
                          {transaction.referenceId && (
                            <>
                              <span>•</span>
                              <span>Ref: {transaction.referenceId}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`text-xl font-bold ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                      </p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ChevronLeft size={16} />
                Previous
              </motion.button>

              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Next
                <ChevronRight size={16} />
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default WalletPage;