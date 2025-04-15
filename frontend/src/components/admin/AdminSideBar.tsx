import { Link } from "react-router-dom";
import { X, Users, Dumbbell, DollarSign, BarChart, Globe } from "lucide-react";
import { SidebarProps } from "../../types/shared.type";
import { SIDEBAR_MESSAGES } from "../../constants/sidebar.messages";

const AdminSidebar = ({ username, onClose, onLogout }: SidebarProps) => {
  return (
    <div className="absolute top-0 right-0 h-full bg-white w-80 p-6 border-l border-gray-100">
      <div className="flex justify-end mb-8">
        <button onClick={onClose} className="p-1 cursor-pointer">
          <X size={18} className="text-gray-400" />
        </button>
      </div>

      {/* Admin greeting */}
      <div className="mb-8">
        <p className="text-gray-700 text-sm">
          {SIDEBAR_MESSAGES.WELCOME} {username || SIDEBAR_MESSAGES.ADMIN}
        </p>
        <div className="mt-1">
          <span className="text-xs text-gray-500">
            {SIDEBAR_MESSAGES.ADMIN}
          </span>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="space-y-4 text-sm" onClick={onClose}>
        <Link
          to="/admin"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <BarChart size={14} />
          {SIDEBAR_MESSAGES.DASHBOARD}
        </Link>
        <Link
          to="/admin/user-management"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <Users size={14} />
          {SIDEBAR_MESSAGES.USER_MANAGEMENT}
        </Link>
        <Link
          to="/admin/trainer-management"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <Dumbbell size={14} />
          {SIDEBAR_MESSAGES.TRAINER_MANAGEMENT}
        </Link>
        <Link
          to="/admin/finance-management"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <DollarSign size={14} />
          {SIDEBAR_MESSAGES.FINANCE_MANAGEMENT}
        </Link>
        <Link
          to="/admin/report-management"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <BarChart size={14} />
          {SIDEBAR_MESSAGES.REPORT_MANAGEMENT}
        </Link>
        <Link
          to="/admin/community-management"
          className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
        >
          <Globe size={14} />
          {SIDEBAR_MESSAGES.COMMUNITY_MANAGEMENT}
        </Link>
      </nav>

      <div className="mt-12 pt-4 border-t border-gray-100">
        <button
          type="button"
          className="text-xs text-gray-500 cursor-pointer"
          onClick={onLogout}
        >
          {SIDEBAR_MESSAGES.SIGN_OUT}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
