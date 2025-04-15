import { Link } from "react-router-dom";
import { X, Calendar, Users, MessageSquare, FileText, Bell, TrendingUp, Home, LogOut } from "lucide-react";
import { SidebarProps } from "../../types/shared.type";
import { SIDEBAR_MESSAGES } from "../../constants/sidebar.messages";



const TrainerSidebar = ({ username, onClose, onLogout }: SidebarProps) => {
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
        {SIDEBAR_MESSAGES.WELCOME} {username || SIDEBAR_MESSAGES.TRAINER}
        </p>
        <div className="mt-2">
          <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
            {SIDEBAR_MESSAGES.CERTIFIED_TRAINER}
          </span>
        </div>
        <div className="mt-4 flex items-center text-xs text-gray-600">
          <Calendar size={14} className="mr-2" />
          <span><span className="font-medium">0</span> {SIDEBAR_MESSAGES.SESSION_TODAY}</span>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="space-y-4 text-sm" onClick={onClose}>
        <Link
          to="/trainer"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <Home size={14} />
          {SIDEBAR_MESSAGES.DASHBOARD}
        </Link>
        <Link
          to="/trainer/sessions"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <Calendar size={14} />
          {SIDEBAR_MESSAGES.SESSION_MANAGEMENT}
        </Link>
        <Link
          to="/trainer/trainees"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <Users size={14} />
          {SIDEBAR_MESSAGES.TRAINEE_MANAGEMENT}
        </Link>
        <Link
          to="/trainer/chats"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <MessageSquare size={14} />
          {SIDEBAR_MESSAGES.CHATS}
        </Link>
        <Link
          to="/trainer/articles"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <FileText size={14} />
          {SIDEBAR_MESSAGES.ARTICLE_MANAGEMENT}
        </Link>
        <Link
          to="/trainer/upcoming"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <Calendar size={14} />
          {SIDEBAR_MESSAGES.UPCOMING_SESSIONS}
        </Link>
        <Link
          to="/trainer/finance"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <TrendingUp size={14} />
          {SIDEBAR_MESSAGES.FINANCE_MANAGEMENT}
        </Link>
        <Link
          to="/trainer/notifications"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <Bell size={14} />
          {SIDEBAR_MESSAGES.NOTIFICATIONS}
        </Link>
      </nav>

      <div className="mt-12 pt-4 border-t border-gray-100">
        <button
          type="button"
          className="text-xs text-gray-500 cursor-pointer flex items-center gap-2"
          onClick={onLogout}
        >
          <LogOut size={14} />
          {SIDEBAR_MESSAGES.SIGN_OUT}
        </button>
      </div>
    </div>
  );
};
export default TrainerSidebar;