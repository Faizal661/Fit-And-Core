import { useState, useEffect, Fragment } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Check, CheckCheck } from "lucide-react";
import io from "socket.io-client";
import { useToast } from "../../context/ToastContext";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import * as api from "../../services/notification/notificationService";
import type { Notification } from "../../services/notification/notificationService";
import { formatTimeAgo } from "../../utils/dateFormat";
import { useNavigate } from "react-router-dom";

const buttonVariants = {
  initial: { scale: 1 },
  animate: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: -50,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: -50,
    transition: {
      duration: 0.2,
    },
  },
};

const NotificationButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userId = useSelector((state: RootState) => state.auth.user?.id || "");
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const {
    data: notifications,
    isLoading,
    error,
  } = useQuery<Notification[]>({
    queryKey: ["notifications", userId],
    queryFn: () => api.getNotifications(userId, true),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: ({
      notificationId,
      userId,
    }: {
      notificationId: string;
      userId: string;
    }) => api.markNotificationAsRead(notificationId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      console.error("Failed to mark notification as read:", error);
      showToast(
        "error",
        "Failed to mark notification as read. Please try again."
      );
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: (userId: string) => api.markAllNotificationsAsRead(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      console.error("Failed to mark all notifications as read:", error);
      showToast(
        "error",
        "Failed to mark all notifications as read. Please try again."
      );
    },
  });

  useEffect(() => {
    if (!userId) return;

    const newSocket = io(`${import.meta.env.VITE_API_URL}`);

    newSocket.on("connect", () => {
      console.log("Socket.IO connected for notifications");
      newSocket.emit("registerUserSocket", userId);
    });

    newSocket.on("newNotification", (newNotification: Notification) => {
      console.log("New notification received via Socket.IO:", newNotification);
      queryClient.setQueryData<Notification[]>(
        ["notifications", userId],
        (oldNotifications) => {
          return oldNotifications
            ? [newNotification, ...oldNotifications]
            : [newNotification];
        }
      );
      showToast("info", `New Notification: ${newNotification.message}`, 5000);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket.IO disconnected for notifications");
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket.IO connection error:", err);
    });

    return () => {
      newSocket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, queryClient]);

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsReadMutation.mutate({
        notificationId: notification._id,
        userId,
      });
    }
  };

  const handleViewMoreDetails = (link: string) => {
    navigate(link);
    setIsModalOpen(false)
  };
 
  return (
    <Fragment>
      {/* Notification Button */}
      <motion.button
        onClick={() => setIsModalOpen(true)}
        variants={buttonVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="tap"
        className="fixed top-4 left-21 bg-white text-gray-800 py-2.5 px-5 rounded-lg shadow-lg hover:shadow-sm transition-all cursor-pointer z-50 "
      >
        <Bell size={18} />
        {
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </motion.span>
        }
      </motion.button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-xs flex items-start justify-center z-50 pt-20 px-4"
            onClick={() => setIsModalOpen(false)}
          >
            {/* Modal Content */}
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between py-3 px-5 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Bell size={24} className="text-gray-700" />
                  <h3 className="text-xl font-semibold text-gray-800">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="bg-red-100 text-red-600 text-sm px-2 py-1 rounded-full font-medium">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : error ? (
                  <div className="p-6 text-center">
                    <p className="text-red-600 font-medium">
                      Error loading notifications
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      {error.message}
                    </p>
                  </div>
                ) : notifications && notifications.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {notifications.map(
                      (notification: Notification, index: number) => (
                        <motion.div
                          key={notification._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-4 transition-all cursor-pointer hover:bg-gray-50 ${
                            !notification.read
                              ? "bg-blue-50 border-l-4 border-blue-500"
                              : "bg-white"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                                !notification.read
                                  ? "bg-blue-500"
                                  : "bg-gray-300"
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm leading-relaxed ${
                                  !notification.read
                                    ? "text-gray-900 font-medium"
                                    : "text-gray-600"
                                }`}
                              >
                                {notification.message}
                              </p>
                              {notification.link && (
                                <p
                                  className={`text-sm leading-relaxed text-blue-500 underline`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewMoreDetails(notification.link!);
                                  }}
                                >
                                  More Details
                                </p>
                              )}
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-500">
                                  {formatTimeAgo(notification.createdAt)}
                                </span>
                                {!notification.read && (
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleNotificationClick(notification);
                                    }}
                                    className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                                    title="Mark as read"
                                  >
                                    <Check
                                      size={18}
                                      className="text-blue-600 "
                                    />
                                  </motion.button>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-6">
                    <Bell size={48} className="text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">
                      No notifications yet
                    </p>
                    <p className="text-gray-400 text-sm text-center mt-1">
                      When you receive notifications, they'll appear here
                    </p>
                  </div>
                )}
              </div>
              {/* Mark All as Read Button */}
              {notifications && notifications.length > 0 && unreadCount > 0 && (
                <div className="p-2 border-gray-100">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => markAllAsReadMutation.mutate(userId)}
                    disabled={markAllAsReadMutation.isPending}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg transition-colors font-medium"
                  >
                    <CheckCheck size={16} />
                    {markAllAsReadMutation.isPending
                      ? "Marking all..."
                      : "Mark All as Read"}
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Fragment>
  );
};

export default NotificationButton;
