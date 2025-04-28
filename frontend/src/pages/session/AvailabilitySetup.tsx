import { useState, FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAvailability } from "../../services/session/sessionService";
import Footer from "../../components/shared/Footer";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Calendar as CalendarIcon, Clock, Timer } from "lucide-react";
import { SUCCESS_MESSAGES } from "../../constants/success.messages";
import { STATUS } from "../../constants/status.messges";
import { useToast } from "../../context/ToastContext";

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

const AvailabilitySetupPage = () => {
  const queryClient = useQueryClient();
  const {showToast}=useToast()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const initialDate = new Date(); 
  initialDate.setDate(initialDate.getDate() + 1);
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [slotDuration, setSlotDuration] = useState(30);

  // Get next 7 days
  const getNextSevenDays = () => {
    const today = new Date();
    const dates = []; 
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i + 1);
      dates.push(date);
    }
    // setSelectedDate(today)
    return dates;
  };

  const nextSevenDays = getNextSevenDays();

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };


    const mutation = useMutation({
      mutationFn:createAvailability,
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["trainerAvailability"]});
        showToast(STATUS.SUCCESS,SUCCESS_MESSAGES.AVAILABILITY_SAVED)
      },
    });

    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      mutation.mutate({ selectedDate, startTime, endTime, slotDuration });
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
          className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        >
          <motion.h1
            variants={fadeIn}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Set Your Availability
          </motion.h1>
          <motion.div
            variants={fadeIn}
            className="w-20 h-1 bg-white/30 mx-auto mb-6 rounded-full"
          ></motion.div>
          <motion.p
            variants={fadeIn}
            className="text-white/80 max-w-2xl mx-auto"
          >
            Choose your available time slots for training sessions
          </motion.p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 -mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl border border-gray-100 p-8 mb-16"
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* Date Selection */}
            <div>
              <label className="flex items-center gap-2 text-lg font-semibold mb-4">
                <CalendarIcon className="text-blue-600" size={24} />
                Select Date
              </label>
              <div className="grid grid-cols-7 gap-2">
                {nextSevenDays.map((date) => (
                  <motion.button
                    key={date.toISOString()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setSelectedDate(date)}
                    className={`p-3 rounded-xl text-center transition-all duration-300 ${
                      isSelected(date)
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <div className="text-xs mb-1">
                      {date.toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                    <div className="font-semibold">{date.getDate()}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <Clock className="text-emerald-600" size={24} />
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <Clock className="text-red-600" size={24} />
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Slot Duration */}
            <div>
              <label className="flex items-center gap-2 text-lg font-semibold mb-4">
                <Timer className="text-purple-600" size={24} />
                Session Duration
              </label>
              <div className="relative">
                <input
                  type="range"
                  min={15}
                  max={60}
                  step={5}
                  value={slotDuration}
                  onChange={(e) =>
                    setSlotDuration(parseInt(e.target.value, 10))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="absolute -top-2 left-0 right-0 flex justify-between text-xs text-gray-500">
                  <span>15m</span>
                  <span>60m</span>
                </div>
                <div className="text-center mt-4">
                  <span className="text-2xl font-bold text-gray-700">
                    {slotDuration}
                  </span>
                  <span className="text-gray-500 ml-1">minutes</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={mutation.isPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {mutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
              <>
                <CalendarIcon size={20} />
                <span>Save Availability</span>
              </>
              )} 
            </motion.button>
          </form>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default AvailabilitySetupPage;
