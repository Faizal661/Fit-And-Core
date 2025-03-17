import { Link } from "react-router-dom";
import { X, Users, Dumbbell, DollarSign, BarChart, Globe } from "lucide-react";

interface AdminSidebarProps {
  username: string | undefined;
  onClose: () => void;
  onLogout: () => void;
}

const AdminSidebar = ({ username, onClose, onLogout }: AdminSidebarProps) => {
  return (
    <div className="absolute top-0 right-0 h-full bg-white w-96 p-3 pl-8 shadow-lg">
      <div className="flex justify-between items-center mb-6 pt-2">
        <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded-full cursor-pointer">
          <X size={25} color="blue" />
        </button>
      </div>

      {/* Admin greeting */}
      <div className="mb-6 pt-5">
        <p className="text-gray-700 font-semibold text-lg">
          Hi Admin {username || ""}, welcome back!
        </p>
        <div className="mt-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            Administrator
          </span>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="pt-3 space-y-3 text-md flex flex-col font-semibold"  onClick={onClose}>
        <Link
          to="/admin"
          className="text-gray-950 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors flex items-center gap-3"
        >
          <BarChart size={18} />
          DASHBOARD
        </Link>
        <Link
          to="/admin/user-management"
          className="text-gray-950 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors flex items-center gap-3"
        >
          <Users size={18} />
          USER MANAGEMENT
        </Link>
        <Link
          to="/admin/trainer-management"
          className="text-gray-950 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors flex items-center gap-3"
        >
          <Dumbbell size={18} />
          TRAINER MANAGEMENT
        </Link>
        <Link
          to="/admin/finance-management"
          className="text-gray-950 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors flex items-center gap-3"
        >
          <DollarSign size={18} />
          FINANCE MANAGEMENT
        </Link>
        <Link
          to="/admin/report-management"
          className="text-gray-950 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors flex items-center gap-3"
        >
          <BarChart size={18} />
          REPORT MANAGEMENT
        </Link>
        <Link
          to="/admin/community-management"
          className="text-gray-950 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors flex items-center gap-3"
        >
          <Globe size={18} />
          COMMUNITY MANAGEMENT
        </Link>
        <Link
          to="/admin/settings"
          className="text-gray-950 hover:text-blue-700 hover:bg-blue-50 p-2 rounded transition-colors flex items-center gap-3"
        >
          <Globe size={18} />
          PLATFORM SETTINGS
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

export default AdminSidebar;