import { INotificationModel } from "../../models/notification.models";

export interface INotificationRepository {
  findByUserId(
    userId: string,
    readStatus?: boolean
  ): Promise<INotificationModel[]>;

  markAsRead(
    notificationId: string,
    userId: string
  ): Promise<INotificationModel | null>;

  markAllAsRead(userId: string): Promise<number>;
}
