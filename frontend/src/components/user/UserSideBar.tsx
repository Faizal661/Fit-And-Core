import { Link } from "react-router-dom";
import { X, User, Users, Globe, TrendingUp, Utensils, Bell, History, Home, Award, Calendar } from "lucide-react";

interface UserSidebarProps {
  username: string | undefined;
  onClose: () => void;
  onLogout: () => void;
}

const UserSidebar = ({ username, onClose, onLogout }: UserSidebarProps) => {
  return (
    <div className="absolute top-0 right-0 h-full bg-white w-96 p-3 pl-8 shadow-lg">
      <div className="flex justify-between items-center mb-6 pt-2">
        <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded-full">
          <X size={25} color="blue" />
        </button>
      </div>

      {/* User greeting */}
      <div className="mb-6 pt-5 font-semibold text-md">
        <p className="text-gray-700 font-semibold text-lg">
          Hi {username || "User"}, welcome back!
        </p>
        <div className="flex space-x-4 mt-4">
          <div className="flex items-center border-1 p-2 rounded-md border-[#2916BA] hover:bg-blue-50 transition-colors cursor-pointer">
            <Award size={16} className="mr-1" />
            <span className="text-sm text-gray-600">Credits</span>
          </div>
          <div className="flex items-center border-1 p-2 rounded-md border-[#2916BA] hover:bg-blue-50 transition-colors cursor-pointer">
            <Calendar size={16} className="mr-1" />
            <span className="text-sm text-gray-600">Bookings</span>
          </div>
        </div>
        <div className="flex mt-4">
          <div className="flex items-center border-1 p-2 rounded-md border-[#2916BA] hover:bg-blue-50 transition-colors cursor-pointer">
            <TrendingUp size={16} className="mr-1" />
            <span className="text-sm text-gray-600">Streak: 5</span>
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="pt-3 space-y-2 text-md flex flex-col font-semibold">
        <Link
          to="/"
          className="text-gray-950 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors flex items-center gap-3"
        >
          <Home size={18} />
          HOME
        </Link>
        <Link
          to="/profile"
          className="text-blue-950 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors flex items-center gap-3"
        >
          <User size={18} />
          MY PROFILE
        </Link>
        <Link
          to="/trainers"
          className="text-gray-950 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors flex items-center gap-3"
        >
          <Users size={18} />
          MY TRAINERS
        </Link>
        <Link
          to="/communities"
          className="text-gray-950 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors flex items-center gap-3"
        >
          <Globe size={18} />
          MY COMMUNITIES
        </Link>
        <Link
          to="/progress"
          className="text-gray-950 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors flex items-center gap-3"
        >
          <TrendingUp size={18} />
          MY PROGRESS
        </Link>
        <Link
          to="/nutrition"
          className="text-gray-950 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors flex items-center gap-3"
        >
          <Utensils size={18} />
          NUTRITION TRACKING
        </Link>
        <Link
          to="/notifications"
          className="text-gray-950 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors flex items-center gap-3"
        >
          <Bell size={18} />
          NOTIFICATIONS
        </Link>
        <Link
          to="/history"
          className="text-gray-950 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors flex items-center gap-3"
        >
          <History size={18} />
          HISTORY
        </Link>
      </nav>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          type="button"
          className="text-sm text-gray-950 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors font-semibold cursor-pointer flex items-center gap-3"
          onClick={onLogout}
        >
          <X size={18} />
          SIGN OUT
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;