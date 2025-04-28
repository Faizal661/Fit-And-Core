// import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PlusCircle,
  Clock,
  Calendar,
  User,
  ChevronRight,
  CalendarClock,
} from "lucide-react";
// import { getTrainerBookings, getTrainerAvailability } from "../../../services/sessionService";
import Footer from "../../components/shared/Footer";
import { useInView } from "react-intersection-observer";

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

const SessionManagementPage = () => {
  const navigate = useNavigate();
  const trainerId = "CURRENT_TRAINER_ID";
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  //   const { data: bookings = [], isLoading: loadingBookings } = useQuery(
  //     ["trainerBookings", trainerId],
  //     () => getTrainerBookings(trainerId)
  //   );
  //   const { data: availability = [], isLoading: loadingAvail } = useQuery(
  //     ["trainerAvailability", trainerId],
  //     () => getTrainerAvailability(trainerId)
  //   );

  const handleAddAvailability = () => navigate("/trainer/availability-setup");
  const handleViewBooking = (bookingId: string) =>
    navigate(`/trainer/session/${bookingId}`);

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
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        >
          <motion.h1
            variants={fadeIn}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Session Management
          </motion.h1>
          <motion.div
            variants={fadeIn}
            className="w-20 h-1 bg-white/30 mx-auto mb-6 rounded-full"
          ></motion.div>
          <motion.p
            variants={fadeIn}
            className="text-white/80 max-w-2xl mx-auto"
          >
            Manage your training sessions and availability
          </motion.p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 mb-16 space-y-12"
        >
          {/* Upcoming Sessions */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold">Upcoming Sessions</h2>
            </div>

            {loadingBookings ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading sessions...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No upcoming sessions scheduled</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <motion.div
                    key={booking._id}
                    whileHover={{ y: -5 }}
                    className="p-6 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Clock className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(booking.slotStart).toLocaleString([], {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <User size={14} />
                          <span>{booking.trainee.username}</span>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleViewBooking(booking._id)}
                      className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                    >
                      View Details
                      <ChevronRight
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Availability Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CalendarClock className="text-purple-600" size={24} />
                <h2 className="text-2xl font-bold">Your Availability</h2>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddAvailability}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
              >
                <PlusCircle size={18} />
                Add / Edit Availability
              </motion.button>
            </div>

            {loadingAvailability ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading availability...</p>
              </div>
            ) : availability.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <CalendarClock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  You haven't set any availability yet
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availability.map((slot) => (
                  <motion.div
                    key={`${slot.dayOfWeek}-${slot.startTime}`}
                    whileHover={{ y: -5 }}
                    className="p-6 bg-gray-50 rounded-xl border border-gray-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {
                        [
                          "Sunday",
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                        ][slot.dayOfWeek]
                      }
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} />
                      <span>
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {slot.slotDuration} minute sessions
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default SessionManagementPage;

// Dummy loading flags
const loadingBookings = false;
const loadingAvailability = false;

// Dummy bookings array
const bookings = [
  {
    _id: "bkg1",
    slotStart: "2025-05-10T09:00:00.000Z",
    slotEnd: "2025-05-10T09:30:00.000Z",
    trainee: {
      _id: "user123",
      username: "alice_w",
      profilePicture: "https://i.pravatar.cc/40?img=1",
    },
  },
  {
    _id: "bkg2",
    slotStart: "2025-05-11T14:00:00.000Z",
    slotEnd: "2025-05-11T14:30:00.000Z",
    trainee: {
      _id: "user456",
      username: "bob_smith",
      profilePicture: "https://i.pravatar.cc/40?img=2",
    },
  },
  {
    _id: "bkg3",
    slotStart: "2025-05-12T16:30:00.000Z",
    slotEnd: "2025-05-12T17:00:00.000Z",
    trainee: {
      _id: "user789",
      username: "charlie_k",
      profilePicture: "https://i.pravatar.cc/40?img=3",
    },
  },
];

// Dummy availability array
const availability = [
  {
    _id: "avail1",
    dayOfWeek: 1, // Monday
    startTime: "09:00",
    endTime: "12:00",
    slotDuration: 30,
  },
  {
    _id: "avail2",
    dayOfWeek: 3, // Wednesday
    startTime: "14:00",
    endTime: "18:00",
    slotDuration: 30,
  },
  {
    _id: "avail3",
    dayOfWeek: 5, // Friday
    startTime: "10:00",
    endTime: "15:00",
    slotDuration: 30,
  },
];
