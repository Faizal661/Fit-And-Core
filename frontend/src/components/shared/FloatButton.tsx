import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { CircleUserRound, X } from "lucide-react";
import { RootState } from "../../redux/store";
import { logoutUser } from "../../services/authService";
import { useToast } from "../../context/ToastContext";
import { AUTH_MESSAGES } from "../../constants/auth.messages";
import { clearAuth } from "../../redux/slices/authSlice";
import { persistor } from "../../redux/store";

const FloatButton = () => {
  const user = useSelector((state: RootState) => state.auth.user?.username);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const handleButtonClick = () => {
    if (user) {
      setSidebarOpen(!sidebarOpen);
    } else {
      navigate("/login");
    }
  };

  const handleLogout = async () => {
    try {
      const logout = await logoutUser();
      if (logout === true) {
        dispatch(clearAuth());
        await persistor.purge();
        showToast("success", AUTH_MESSAGES.LOGOUT_SUCCESS);
        navigate("/login");
      } else {
        showToast("error", AUTH_MESSAGES.SERVER_ERROR);
      }
    } catch (error) {
      showToast("error", AUTH_MESSAGES.SERVER_ERROR);
    }
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        className="fixed top-3 right-3 bg-white opacity-90 text-[#2916BA] py-2 px-3 rounded-full flex flex-row hover:bg-slate-300 hover:cursor-pointer z-50"
      >
        <CircleUserRound />
        <p className="ml-3 font-bold">
          {user ? user || "Profile" : "Login"}
          {" | fit and core"}
        </p>
      </button>

      {/* Conditionally show sidebar */}
      {user && sidebarOpen && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0  bg-black/10 backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="absolute top-0 right-0 h-full bg-white w-96 p-3 pl-8">
            <div className="flex justify-between items-center mb-6 pt-2">
              <button onClick={() => setSidebarOpen(false)}>
                <X size={25} color="blue" />
              </button>
            </div>

            {/* User greeting */}
            <div className="mb-6 pt-5 font-semibold text-md">
              <p className="text-gray-700 font-semibold text-lg">
                Hi {user || "User"}, welcome back!
              </p>
              <div className="flex space-x-4 mt-4">
                <div className="flex items-center border-1 p-2 rounded-md border-[#2916BA]">
                  {/* <div className="w-4 h-4 bg-blue-500 rounded-full"></div> */}
                  <span className="ml-2 text-sm text-gray-600">Credits</span>
                </div>
                <div className="flex items-center border-1 p-2 rounded-md border-[#2916BA]">
                  {/* <div className="w-4 h-4 bg-blue-500 rounded-full"></div> */}
                  <span className="ml-2 text-sm text-gray-600">Bookings</span>
                </div>
              </div>
              <div className="flex mt-4">
                <div className="flex items-center border-1 p-2 rounded-md border-[#2916BA]">
                  {/* <div className="w-4 h-4 bg-blue-500 rounded-full"></div> */}
                  <span className="ml-2 text-sm text-gray-600">Streak: 5</span>
                </div>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="pt-3 space-y-3 text-md flex flex-col font-semibold">
              <Link
                to="/profile"
                className=" text-blue-950 hover:text-blue-700"
              >
                MY PROFILE
              </Link>
              <Link
                to="/trainers"
                className=" text-gray-950 hover:text-blue-700"
              >
                MY TRAINERS
              </Link>
              <Link
                to="/communities"
                className=" text-gray-950 hover:text-blue-700"
              >
                MY COMMUNITIES
              </Link>
              <Link
                to="/progress"
                className=" text-gray-950 hover:text-blue-700"
              >
                MY PROGRESS
              </Link>
              <Link
                to="/nutrition"
                className=" text-gray-950 hover:text-blue-700"
              >
                NUTRITION TRACKING
              </Link>
              <Link
                to="/notifications"
                className=" text-gray-950 hover:text-blue-700"
              >
                NOTIFICATIONS
              </Link>
              <Link
                to="/history"
                className=" text-gray-950 hover:text-blue-700"
              >
                HISTORY
              </Link>
            </nav>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                className="text-sm text-gray-950 hover:text-blue-700"
                onClick={() => handleLogout()}
              >
                SIGN OUT
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatButton;
