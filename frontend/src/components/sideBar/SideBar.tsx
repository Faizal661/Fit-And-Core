import { Link } from "react-router-dom";
import { X, LogOut } from "lucide-react";
import { SidebarItem, SidebarProps } from "../../types/shared.type";
import { SIDEBAR_MESSAGES } from "../../constants/messages/sidebar.messages";
import {
  UserSidebarItems,
  TrainerSidebarItems,
  AdminSidebarItems,
  QuickActions,
} from "./sidebar.config";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const sidebarVariants = {
  open: {
    x: 0,
    transition: { type: "tween", stiffness: 20, damping: 20, duration: 0.3 },
  },
  closed: { x: "100%", transition: { type: "tween", duration: 0.2 } },
};

const linkVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const Sidebar: React.FC<SidebarProps> = ({
  role,
  username,
  onClose,
  onLogout,
}) => {
  let sidebarItems: SidebarItem[];
  let greetingMessage;
  let quickActions;
  let memberInfo;
  let certificationInfo;
  // let sessionsToday;

  switch (role) {
    case "user":
      sidebarItems = UserSidebarItems;
      greetingMessage = `${SIDEBAR_MESSAGES.WELCOME} ${
        username || SIDEBAR_MESSAGES.USER
      }`;
      quickActions = QuickActions.user;
      memberInfo = (
        <span className="text-xs text-gray-500">{SIDEBAR_MESSAGES.MEMBER}</span>
      );
      break;
    case "trainer":
      sidebarItems = TrainerSidebarItems;
      greetingMessage = `${SIDEBAR_MESSAGES.WELCOME} ${
        username || SIDEBAR_MESSAGES.TRAINER
      }`;
      certificationInfo = (
        <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
          {SIDEBAR_MESSAGES.CERTIFIED_TRAINER}
        </span>
      );
      // sessionsToday = (
      //   <div className="mt-4 flex items-center text-xs text-gray-600">
      //     <Calendar size={14} className="mr-2" />
      //     <span>
      //       <span className="font-medium">0</span>{" "}
      //       {SIDEBAR_MESSAGES.SESSION_TODAY}
      //     </span>
      //   </div>
      // );
      break;
    case "admin":
      sidebarItems = AdminSidebarItems;
      greetingMessage = `${SIDEBAR_MESSAGES.WELCOME} ${
        username || SIDEBAR_MESSAGES.ADMIN
      }`;
      memberInfo = (
        <span className="text-xs text-gray-500">{SIDEBAR_MESSAGES.ADMIN}</span>
      );
      break;
    default:
      sidebarItems = [];
      greetingMessage = "";
  }

  const [ref, inView] = useInView({
    threshold: 0.1,
  });

  return (
    <motion.div
      className="absolute top-0 right-0 h-full bg-white w-80 p-6 border-l border-gray-100 shadow-sm overflow-y-auto"
      variants={sidebarVariants}
      initial="closed"
      animate="open"
      exit="closed"
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      <div className="flex justify-end mb-8">
        <button
          onClick={onClose}
          className="p-2 cursor-pointer rounded-full hover:bg-gray-100 focus:outline-none"
        >
          <X size={18} className="text-gray-400" />
        </button>
      </div>

      {/* User greeting */}
      <div className="mb-8">
        <p className="text-gray-700 text-sm">{greetingMessage}</p>
        {memberInfo && <div className="mt-1">{memberInfo}</div>}
        {certificationInfo && <div className="mt-2">{certificationInfo}</div>}
        {/* {sessionsToday} */}
      </div>

      {/* Quick actions */}
      {quickActions && (
        <div className="flex gap-3 mb-6">
          {quickActions.map((action, index) => (
            <div
              onClick={onClose}
              key={index}
              className="flex items-center text-gray-600 text-xs cursor-pointer hover:text-gray-800 transition-colors duration-150 bg-amber-100 hover:bg-amber-300 p-1 rounded-md" // Added hover effect
            >
              <Link
                to={action.to}
                className="text-gray-600 hover:text-gray-900 flex items-center gap-3 transition-colors duration-150" // Added transition
              >
                <span>{action.label}</span>
                <action.icon size={14} className="" />
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Navigation links */}
      <nav className="space-y-4 text-sm" onClick={onClose}>
        {sidebarItems.map((item, index) => (
          <motion.div
            key={index}
            variants={linkVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Link
              to={item.to}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-3 transition-colors duration-150" // Added transition
            >
              <item.icon size={14} />
              {item.label}
            </Link>
          </motion.div>
        ))}
      </nav>

      <div className="mt-12 pt-4 border-t border-gray-100">
        <motion.button
          type="button"
          className="text-xs text-gray-500 cursor-pointer flex items-center gap-2 hover:text-gray-700 transition-colors duration-150 focus:outline-none" // Added hover effect and focus reset
          onClick={onLogout}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={14} />
          {SIDEBAR_MESSAGES.SIGN_OUT}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
