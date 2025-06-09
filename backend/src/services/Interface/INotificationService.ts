import { INotification, INotificationModel } from "../../models/notification.models";

export interface INotificationService {
  sendNotification(
    notificationData: INotification
  ): Promise<INotificationModel>;

  getNotifications(
    userId: string,
    unreadOnly: boolean
  ): Promise<INotificationModel[]>;

  markNotificationAsRead(
    notificationId: string,
    userId: string
  ): Promise<INotificationModel | null>;

  markAllNotificationsAsRead(userId: string): Promise<number>;
}
