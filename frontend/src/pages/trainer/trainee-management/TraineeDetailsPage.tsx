import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  User,
  Mail,
  Phone,
  Calendar,
  Activity,
  Apple,
  History,
  Clock,
  Award,
  TrendingUp,
  Scale,
  Dumbbell,
  Timer
} from 'lucide-react';

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

type Tab = 'info' | 'progress' | 'nutrition' | 'history';

const TraineeDetailsPage = () => {
  const { traineeId } = useParams<{ traineeId: string }>();
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Dummy data - replace with actual data from your backend
  const trainee = {
    id: traineeId,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 234 567 8900",
    joinedDate: "2024-01-15",
    profilePicture: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600",
    age: 28,
    height: "165 cm",
    weight: "58 kg",
    goals: ["Weight Loss", "Muscle Gain", "Better Endurance"],
    subscriptionHistory: [
      {
        id: 1,
        plan: "6 Months Plan",
        startDate: "2024-01-15",
        endDate: "2024-07-15",
        status: "Active",
        amount: "₹7,500"
      }
    ],
    sessionHistory: [
      {
        id: 1,
        date: "2024-03-10",
        time: "09:00 AM",
        duration: "30 minutes",
        type: "Personal Training",
        status: "Completed"
      },
      {
        id: 2,
        date: "2024-03-15",
        time: "10:00 AM",
        duration: "30 minutes",
        type: "Personal Training",
        status: "Upcoming"
      }
    ]
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
          className="relative z-10 max-w-6xl mx-auto px-6"
        >
          <div className="flex items-start gap-8">
            <motion.div variants={fadeIn} className="relative">
              <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-white/20 shadow-xl">
                <img
                  src={trainee.profilePicture}
                  alt={trainee.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="flex-grow">
              <h1 className="text-4xl font-bold text-white mb-4">{trainee.name}</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <Mail size={18} />
                  <span>{trainee.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={18} />
                  <span>{trainee.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>Joined: {new Date(trainee.joinedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award size={18} />
                  <span>Active Member</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl overflow-hidden"
        >
          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex items-center gap-2 py-4 px-6 transition-colors duration-300 ${
                activeTab === 'info'
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <User size={18} />
              Basic Information
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`flex items-center gap-2 py-4 px-6 transition-colors duration-300 ${
                activeTab === 'progress'
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Activity size={18} />
              Progress Tracking
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`flex items-center gap-2 py-4 px-6 transition-colors duration-300 ${
                activeTab === 'nutrition'
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Apple size={18} />
              Nutrition
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 py-4 px-6 transition-colors duration-300 ${
                activeTab === 'history'
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <History size={18} />
              History
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'info' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {/* Physical Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Age</p>
                        <p className="font-semibold">{trainee.age} years</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Scale className="text-purple-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Weight</p>
                        <p className="font-semibold">{trainee.weight}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <TrendingUp className="text-emerald-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Height</p>
                        <p className="font-semibold">{trainee.height}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fitness Goals */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Fitness Goals</h3>
                  <div className="flex flex-wrap gap-2">
                    {trainee.goals.map((goal, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
                      >
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'progress' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Dumbbell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Progress Tracking Coming Soon</h3>
                <p className="text-gray-500">
                  We're working on bringing you detailed progress tracking features.
                </p>
              </motion.div>
            )}

            {activeTab === 'nutrition' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Apple className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nutrition Tracking Coming Soon</h3>
                <p className="text-gray-500">
                  Detailed nutrition tracking and meal planning features are on the way.
                </p>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {/* Subscription History */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Subscription History</h3>
                  <div className="space-y-4">
                    {trainee.subscriptionHistory.map((subscription) => (
                      <div
                        key={subscription.id}
                        className="p-6 bg-gray-50 rounded-xl border border-gray-100"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                              <Award className="text-green-600" size={20} />
                            </div>
                            <div>
                              <h4 className="font-medium">{subscription.plan}</h4>
                              <p className="text-sm text-gray-500">{subscription.amount}</p>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                            {subscription.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span>Start: {new Date(subscription.startDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span>End: {new Date(subscription.endDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Session History */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Session History</h3>
                  <div className="space-y-4">
                    {trainee.sessionHistory.map((session) => (
                      <div
                        key={session.id}
                        className="p-6 bg-gray-50 rounded-xl border border-gray-100"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Timer className="text-blue-600" size={20} />
                            </div>
                            <div>
                              <h4 className="font-medium">{session.type}</h4>
                              <p className="text-sm text-gray-500">{session.duration}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            session.status === 'Completed'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-blue-100 text-blue-600'
                          }`}>
                            {session.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span>{session.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={16} />
                            <span>{session.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TraineeDetailsPage;