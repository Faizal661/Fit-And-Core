import { Link } from "react-router-dom";
import { X, LogOut, Calendar } from "lucide-react";
import { SidebarItem, SidebarProps } from "../../../types/shared.type"; 
import { SIDEBAR_MESSAGES } from "../../../constants/sidebar.messages";
import { UserSidebarItems, TrainerSidebarItems, AdminSidebarItems, QuickActions } from "./sidebar.config";

const Sidebar: React.FC<SidebarProps> = ({ role, username, onClose, onLogout }) => {

  let sidebarItems:SidebarItem[];
  let greetingMessage;
  let quickActions;
  let memberInfo;
  let certificationInfo;
  let sessionsToday;

  switch (role) {
    case 'user':
      sidebarItems = UserSidebarItems;
      greetingMessage = `${SIDEBAR_MESSAGES.WELCOME} ${username || SIDEBAR_MESSAGES.USER}`;
      quickActions = QuickActions.user;
      memberInfo = <span className="text-xs text-gray-500">{SIDEBAR_MESSAGES.MEMBER}</span>;
      break;
    case 'trainer':
      sidebarItems = TrainerSidebarItems;
      greetingMessage = `${SIDEBAR_MESSAGES.WELCOME} ${username || SIDEBAR_MESSAGES.TRAINER}`;
      certificationInfo = (
        <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
          {SIDEBAR_MESSAGES.CERTIFIED_TRAINER}
        </span>
      );
      sessionsToday = (
        <div className="mt-4 flex items-center text-xs text-gray-600">
          <Calendar size={14} className="mr-2" />
          <span>
            <span className="font-medium">0</span> {SIDEBAR_MESSAGES.SESSION_TODAY}
          </span>
        </div>
      );
      break;
    case 'admin':
      sidebarItems = AdminSidebarItems;
      greetingMessage = `${SIDEBAR_MESSAGES.WELCOME} ${username || SIDEBAR_MESSAGES.ADMIN}`;
      memberInfo = <span className="text-xs text-gray-500">{SIDEBAR_MESSAGES.ADMIN}</span>;
      break;
    default:
      sidebarItems = [];
      greetingMessage = '';
  }

  return (
    <div className="absolute top-0 right-0 h-full bg-white w-80 p-6 border-l border-gray-100 shadow-sm overflow-y-auto">
      <div className="flex justify-end mb-8">
        <button onClick={onClose} className="p-1 cursor-pointer">
          <X size={18} className="text-gray-400" />
        </button>
      </div>

      {/* User greeting */}
      <div className="mb-8">
        <p className="text-gray-700 text-sm">{greetingMessage}</p>
        {memberInfo && <div className="mt-1">{memberInfo}</div>}
        {certificationInfo && <div className="mt-2">{certificationInfo}</div>}
        {sessionsToday}
      </div>

      {/* Quick actions */}
      {quickActions && (
        <div className="flex gap-3 mb-6">
          {quickActions.map((action, index) => (
            <div key={index} className="flex items-center text-gray-600 text-xs cursor-pointer">
              <action.icon size={14} className="mr-1" />
              <span>{action.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Navigation links */}
      <nav className="space-y-4 text-sm" onClick={onClose}>
        {sidebarItems.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-3"
          >
            <item.icon size={14} />
            {item.label}
          </Link>
        ))}
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

export default Sidebar;