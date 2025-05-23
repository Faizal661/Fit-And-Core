import { motion } from "framer-motion";
import { Mail, Calendar, Award } from "lucide-react";
import React from "react";
import { TraineeData } from "../../../types/trainee.type";

interface TraineeProfileHeaderProps {
  traineeData: TraineeData;
  inView: boolean;
  ref: (node?: Element | null | undefined) => void;
  staggerContainer: any;
  fadeIn: any;
  formatDate: (dateString: string) => string;
}

const TraineeProfileHeader = React.forwardRef<HTMLDivElement, TraineeProfileHeaderProps>(
  ({ traineeData, inView, staggerContainer, fadeIn, formatDate }, ref) => {
    return (
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
                src={traineeData.profilePicture}
                alt={traineeData.username}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div variants={fadeIn} className="flex-grow">
            <h1 className="text-4xl font-bold text-white mb-4">
              {traineeData.username}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <Mail size={18} />
                <span>{traineeData.email}</span>
              </div>
              {/* {traineeData.username && (
                <div className="flex items-center gap-2">
                  <Phone size={18} />
                  <span>{traineeData.username}</span>
                </div>
              )} */}
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>Joined: {formatDate(traineeData.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={18} />
                <span>
                  {traineeData.isBlocked ? "Blocked Member" : "Active Member"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }
);

TraineeProfileHeader.displayName = "TraineeProfileHeader";

export default TraineeProfileHeader;