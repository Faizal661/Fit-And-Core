import { Link } from "react-router-dom";
import { X, Calendar, Users, MessageSquare, FileText, Bell, TrendingUp } from "lucide-react";

interface TrainerSidebarProps {
  username: string | undefined;
  onClose: () => void;
  onLogout: () => void;
}

const TrainerSidebar = ({ username, onClose, onLogout }: TrainerSidebarProps) => {
  return (
    <div className="absolute top-0 right-0 h-full bg-white w-96 p-3 pl-8 shadow-lg">
      <div className="flex justify-between items-center mb-6 pt-2">
        <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded-full cursor-pointer">
          <X size={25} color="blue" />
        </button>
      </div>

      {/* Trainer greeting */}
      <div className="mb-6 pt-5">
        <p className="text-gray-700 font-semibold text-lg">
          Hi Coach {username || ""}, welcome back!
        </p>
        <div className="mt-2">
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            Certified Trainer
          </span>
        </div>
        <div className="flex space-x-4 mt-4">
          <div className="flex items-center border-1 p-2 rounded-md border-[#2916BA] hover:bg-blue-50 transition-colors cursor-pointer">
            <Calendar size={16} className="mr-2" />
            <span className="text-sm text-gray-600">
              <span className="font-bold">3</span> Sessions Today
            </span>
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="pt-3 space-y-3 text-md flex flex-col font-semibold">
        <Link
          to="/trainer/sessions"
          className="text-gray-950 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors flex items-center gap-3"
        >
          <Calendar size={18} />
          SESSION MANAGEMENT
        </Link>
        <Link
          to="/trainer/trainees"
          className="text-gray-950 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors flex items-center gap-3"
        >
          <Users size={18} />
          TRAINEE MANAGEMENT
        </Link>
        <Link
          to="/trainer/chats"
          className="text-gray-950 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors flex items-center gap-3"
        >
          <MessageSquare size={18} />
          CHATS
        </Link>
        <Link
          to="/trainer/articles"
          className="text-gray-950 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors flex items-center gap-3"
        >
          <FileText size={18} />
          ARTICLE MANAGEMENT
        </Link>
        <Link
          to="/trainer/upcoming"
          className="text-gray-950 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors flex items-center gap-3"
        >
          <Calendar size={18} />
          UPCOMING SESSIONS
        </Link>
        <Link
          to="/trainer/finance"
          className="text-gray-950 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors flex items-center gap-3"
        >
          <TrendingUp size={18} />
          FINANCE TRACKING
        </Link>
        <Link
          to="/trainer/notifications"
          className="text-gray-950 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors flex items-center gap-3"
        >
          <Bell size={18} />
          NOTIFICATIONS
        </Link>
      </nav>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          type="button"
          className="text-sm text-gray-950 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors font-semibold cursor-pointer"
          onClick={onLogout}
        >
          SIGN OUT
        </button>
      </div>
    </div>
  );
};

export default TrainerSidebar;