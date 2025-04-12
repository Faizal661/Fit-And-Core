import { Link } from "react-router-dom";
import { X, Calendar, Users, MessageSquare, FileText, Bell, TrendingUp, Home, LogOut } from "lucide-react";

interface TrainerSidebarProps {
  username: string | undefined;
  onClose: () => void;
  onLogout: () => void;
}

const TrainerSidebar = ({ username, onClose, onLogout }: TrainerSidebarProps) => {
  return (
    <div className="absolute top-0 right-0 h-full bg-white w-80 p-6 border-l border-gray-100 shadow-sm">
      <div className="flex justify-end mb-8">
        <button onClick={onClose} className="p-1 cursor-pointer">
          <X size={18} className="text-gray-400" />
        </button>
      </div>

      {/* Trainer greeting */}
      <div className="mb-8">
        <p className="text-gray-700 text-sm">
          Welcome back, Coach {username || ""}
        </p>
        <div className="mt-2">
          <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
            Certified Trainer
          </span>
        </div>
        <div className="mt-4 flex items-center text-xs text-gray-600">
          <Calendar size={14} className="mr-2" />
          <span><span className="font-medium">3</span> Sessions Today</span>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="space-y-4 text-sm" onClick={onClose}>
        <Link
          to="/trainer"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <Home size={14} />
          Dashboard
        </Link>
        <Link
          to="/trainer/sessions"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <Calendar size={14} />
          Session Management
        </Link>
        <Link
          to="/trainer/trainees"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <Users size={14} />
          Trainee Management
        </Link>
        <Link
          to="/trainer/chats"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <MessageSquare size={14} />
          Chats
        </Link>
        <Link
          to="/trainer/articles"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <FileText size={14} />
          Article Management
        </Link>
        <Link
          to="/trainer/upcoming"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <Calendar size={14} />
          Upcoming Sessions
        </Link>
        <Link
          to="/trainer/finance"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <TrendingUp size={14} />
          Finance Tracking
        </Link>
        <Link
          to="/trainer/notifications"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <Bell size={14} />
          Notifications
        </Link>
      </nav>

      <div className="mt-12 pt-4 border-t border-gray-100">
        <button
          type="button"
          className="text-xs text-gray-500 cursor-pointer flex items-center gap-2"
          onClick={onLogout}
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </div>
  );
};
export default TrainerSidebar;