import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CircleUserRound} from "lucide-react";
import { RootState } from "../../redux/store";
import { logoutUser } from "../../services/authService";
import { useToast } from "../../context/ToastContext";
import { AUTH_MESSAGES } from "../../constants/auth.messages";
import { clearAuth } from "../../redux/slices/authSlice";
import { persistor } from "../../redux/store";
import axios from "axios";

import UserSidebar from "../user/UserSideBar";
import AdminSidebar from "../admin/AdminSideBar";
import TrainerSidebar from "../trainer/TrainerSideBar";

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
      showToast("success", AUTH_MESSAGES.LOGOUT_SUCCESS);
    } catch (error) {
      dispatch(clearAuth());
      await persistor.purge();
      navigate("/login");
      if (axios.isAxiosError(error)) {
        showToast("error", error.message);
      } else {
        showToast("warning", AUTH_MESSAGES.SESSION_EXPIRED);
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
    return `${username || "Profile"} | fit and core`;
  };

  const renderSidebar = () => {
    if (!username) return null;

    switch (role) {
      case "admin":
        return (
          <AdminSidebar
            username={username}
            onClose={handleCloseSidebar}
            onLogout={handleLogout}
          />
        );
      case "trainer":
        return (
          <TrainerSidebar
            username={username}
            onClose={handleCloseSidebar}
            onLogout={handleLogout}
          />
        );
      default:
        return (
          <UserSidebar
            username={username}
            onClose={handleCloseSidebar}
            onLogout={handleLogout}
          />
        );
    }
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        className="fixed top-3 right-3 bg-white opacity-90 text-[#2916BA] py-2 px-3 rounded-full flex flex-row border-b-2 border-b-amber-500 border-t-2 border-t-fuchsia-500 border-l-2 border-l-red-500 border-r-2 border-r-green-400 hover:bg-slate-300 hover:cursor-pointer z-50 shadow-md transition-all"
      >
        <CircleUserRound />
        <p className="ml-3 font-bold">{getButtonText()}</p>
      </button>

      {/* Conditionally show sidebar */}
      {username && sidebarOpen && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/10 backdrop-blur-xs"
            onClick={handleCloseSidebar}
          ></div>

          {/* Dynamically render the appropriate sidebar */}
          {renderSidebar()}
        </div>
      )}
    </>
  );
};

export default FloatButton;
