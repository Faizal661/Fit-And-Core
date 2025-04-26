import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CircleUserRound, Settings, UserCog } from "lucide-react";
import { RootState } from "../../../redux/store";
import { logoutUser } from "../../../services/authService";
import { useToast } from "../../../context/ToastContext";
import { AUTH_MESSAGES } from "../../../constants/auth.messages";
import { clearAuth } from "../../../redux/slices/authSlice";
import { persistor } from "../../../redux/store";
import axios from "axios";
import Sidebar from "../sideBar/SideBar";
import { STATUS } from "../../../constants/status.messges";

// Animation variants
const buttonVariants = {
  initial: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  hover: {
    // scale: 1.03,
    // boxShadow:
    //   "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)",
    // transition: {
    //   duration: 0.3,
    // },
  },
  tap: {
    scale: 0.80,
  },
};
const sidebarVariants = {
  hidden: { x: "97%" },
  visible: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      duration: 0.8,
      ease: "easeInOut",
    },
  },
};

const FloatButton = () => {
  const username = useSelector((state: RootState) => state.auth.user?.username);
  const role = useSelector((state: RootState) => state.auth.user?.role);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const handleButtonClick = () => {
    if (username) {
      setSidebarOpen(!sidebarOpen);
    } else {
      navigate("/login");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(clearAuth());
      await persistor.purge();
      navigate("/login");
      setSidebarOpen(!sidebarOpen);
      showToast(STATUS.SUCCESS, AUTH_MESSAGES.LOGOUT_SUCCESS);
    } catch (error) {
      dispatch(clearAuth());
      await persistor.purge();
      navigate("/login");
      if (axios.isAxiosError(error)) {
        showToast(STATUS.ERROR, error.message);
      } else {
        showToast(STATUS.WARNING, AUTH_MESSAGES.SESSION_EXPIRED);
      }
    }
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const getButtonText = () => {
    if (!username) return "Login  | fit and core ";
    if (role === "admin") return `${username || "Admin"} | Admin Panel`;
    if (role === "trainer") return `${username || "Coach"} | Trainer Portal`;
    return `${username || "User"} | fit and core`;
  };

  const getButtonIcon = () => {
    if (role === "admin") return <UserCog size={18} />;
    if (role === "trainer") return <Settings size={18} />;
    return <CircleUserRound size={18} />;
  };

  return (
    <>
      <motion.button
        onClick={handleButtonClick}
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        className={`fixed top-4 right-4 bg-white text-gray-800 py-2.5 px-5 rounded-lg flex items-center gap-2 ${
          sidebarOpen ? "" : "shadow-lg backdrop-blur-sm bg-white/90"
        } z-50 font-medium transition-all duration-300`}
      >
        {getButtonIcon()}
        <span>{getButtonText()}</span>
      </motion.button>

      <AnimatePresence>
        {username && sidebarOpen && (
          <div className="fixed inset-0 z-40">
            <motion.div
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50"
            >
              <Sidebar
                role={role}
                username={username}
                onClose={handleCloseSidebar}
                onLogout={handleLogout}
              />
            </motion.div>
            <div
              className="absolute inset-0 bg-black/5 backdrop-blur-sm"
              onClick={handleCloseSidebar}
            ></div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatButton;
