import api from "../../config/axios.config";

export interface Notification {
  _id: string;
  userId: string;
  type: 'subscription_expiry' | 'upcoming_session' | 'general' | 'system_alert';
  message: string;
  read: boolean;
  link?: string;
  metadata?: Record<string, unknown>;
  createdAt: string; 
  updatedAt: string; 
}

export const getNotifications = async (userId: string, unreadOnly: boolean = false): Promise<Notification[]> => {
  const response = await api.get(`/notifications/${userId}?unreadOnly=${unreadOnly}`);
  return response.data.notifications;
};

export const markNotificationAsRead = async (notificationId: string, userId: string): Promise<Notification> => {
  const response = await api.patch(`/notifications/${userId}/${notificationId}/read`);
  return response.data.notification;
};

export const markAllNotificationsAsRead = async (userId: string): Promise<{ modifiedCount: number }> => {
  const response = await api.patch(`/notifications/${userId}/read-all`);
  return response.data;
};


