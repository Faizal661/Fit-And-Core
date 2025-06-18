import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Trainer } from "../../../types/trainer.type";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { motion } from "framer-motion";
import { Users, MessageCircle, Calendar, ChevronRight, UserPlus, Clock } from "lucide-react";
import Footer from "../../../components/shared/Footer";
import { getSubscribedTrainers } from "../../../services/trainer/trainerService";

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

const TrainersPage = () => {
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.auth.user?.id || "");

  const {
    data: subscribedTrainers = [],
    isLoading,
    error,
  } = useQuery<Trainer[]>({
    queryKey: ["subscribedTrainers", userId],
    queryFn: () => getSubscribedTrainers(userId),
  });

  const handleFindNewTrainers = () => {
    navigate("/find-trainers");
  };

  const handleViewDetails = (trainerId: string) => {
    navigate(`/trainer/${trainerId}`);
  };

  const handleStartChat = (trainerId: string,e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/trainer/chat/${trainerId}`);
  };

  const handleBookSession = (trainerId: string,e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/book-time/${trainerId}`);
  };

  const handleViewSessionDetails = (trainerId: string,e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/session-details/${trainerId}`);
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
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        >
          <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl font-bold text-white mb-4">
            My Trainers
          </motion.h1>
          <motion.div variants={fadeIn} className="w-20 h-1 bg-white/30 mx-auto mb-6 rounded-full"></motion.div>
          <motion.p variants={fadeIn} className="text-white/80 max-w-2xl mx-auto">
            Connect with your personal trainers and schedule your next session
          </motion.p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-16"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 md:mb-0">
              {subscribedTrainers.length} Active Subscriptions
            </h2>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleFindNewTrainers}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            >
              <UserPlus size={20} />
              <span>Find New Trainers</span>
              <ChevronRight size={20} className="opacity-50" />
            </motion.button>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 bg-gray-200 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : subscribedTrainers.length === 0 ? (
            <motion.div
              variants={fadeIn}
              className="text-center py-16 bg-gray-50 rounded-xl"
            >
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-8">You haven't subscribed to anny trainers yet.</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFindNewTrainers}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-300"
              >
                <UserPlus size={20} />
                <span>Browse Available Trainers</span>
                <ChevronRight size={20} className="opacity-50" />
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {subscribedTrainers?.map((trainer, _index) => (
                <motion.div
                  key={trainer._id}
                  variants={fadeIn}
                  whileHover={{ y: -5 }}
                  onClick={() => handleViewDetails(trainer._id)}
                  className="p-6 bg-gray-50 rounded-xl border border-gray-200 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start gap-6">
                    <img
                      src={trainer.profilePicture}
                      alt={`${trainer.username}'s profile`}
                      className="w-20 h-20 rounded-xl object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                    />
                    
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{trainer.username}</h3>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          {trainer.specialization}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4">
                        {trainer.yearsOfExperience} of experience
                      </p>
                      
                      <div className="flex flex-wrap gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => handleStartChat(trainer._id,e)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-300"
                        >
                          <MessageCircle size={18} />
                          <span>Chat</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => handleBookSession(trainer._id,e)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                        >
                          <Calendar size={18} />
                          <span>Book Session</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => handleViewSessionDetails(trainer._id,e)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                        >
                          <Clock size={18} />
                          <span>Session Details</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {error && (
            <motion.div
              variants={fadeIn}
              className="text-center py-8 bg-red-50 rounded-xl border border-red-100"
            >
              <p className="text-red-600">Error loading trainers. Please try again later.</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default TrainersPage;