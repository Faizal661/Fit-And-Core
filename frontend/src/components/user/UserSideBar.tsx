import { Link } from "react-router-dom";
import { X, User, Users, Globe, TrendingUp, Utensils, Bell, History, Home, Award, Calendar, FileText, LogOut } from "lucide-react";
import { SidebarProps } from "../../types/shared.type";
import { SIDEBAR_MESSAGES } from "../../constants/sidebar.messages";

const UserSidebar = ({ username, onClose, onLogout }: SidebarProps) => {
return (
    <div className="absolute top-0 right-0 h-full bg-white w-80 p-6 border-l border-gray-100 shadow-sm overflow-y-auto">
      <div className="flex justify-end mb-8">
        <button onClick={onClose} className="p-1 cursor-pointer">
          <X size={18} className="text-gray-400" />
        </button>
      </div>

      {/* User greeting */}
      <div className="mb-8">
        <p className="text-gray-700 text-sm">
          {SIDEBAR_MESSAGES.WELCOME} {username || SIDEBAR_MESSAGES.USER}
        </p>
        <div className="mt-1">
          <span className="text-xs text-gray-500">
            {SIDEBAR_MESSAGES.MEMBER}
          </span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-3 mb-6">
        <div className="flex items-center text-gray-600 text-xs cursor-pointer">
          <Award size={14} className="mr-1" />
          <span>{SIDEBAR_MESSAGES.CREDITS}</span>
        </div>
        <div className="flex items-center text-gray-600 text-xs cursor-pointer">
          <Calendar size={14} className="mr-1" />
          <span>{SIDEBAR_MESSAGES.BOOKINGS}</span>
        </div>
        <div className="flex items-center text-gray-600 text-xs cursor-pointer">
          <TrendingUp size={14} className="mr-1" />
          <span>{SIDEBAR_MESSAGES.STREAK} 0</span>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="space-y-4 text-sm" onClick={onClose}>
        <Link
          to="/"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <Home size={14} />
          {SIDEBAR_MESSAGES.HOME}
        </Link>
        <Link
          to="/profile"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <User size={14} />
          {SIDEBAR_MESSAGES.PROFILE}
        </Link>
        <Link
          to="/articles"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <FileText size={14} />
          {SIDEBAR_MESSAGES.ARTICLES}
        </Link>
        <Link
          to="/trainers"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <Users size={14} />
          {SIDEBAR_MESSAGES.TRAINERS}
        </Link>
        <Link
          to="/communities"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <Globe size={14} />
          {SIDEBAR_MESSAGES.COMMUNITIES}
        </Link>
        <Link
          to="/progress"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <TrendingUp size={14} />
          {SIDEBAR_MESSAGES.PROGRESSION}
        </Link>
       
        <Link
          to="/nutrition"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <Utensils size={14} />
          {SIDEBAR_MESSAGES.NUTRITION}
        </Link>
        <Link
          to="/notifications"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <Bell size={14} />
          {SIDEBAR_MESSAGES.NOTIFICATIONS}
        </Link>
        <Link
          to="/history"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <History size={14} />
          {SIDEBAR_MESSAGES.HISTORY}
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

export default UserSidebar;