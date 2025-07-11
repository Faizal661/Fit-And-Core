import { INotificationModel } from "../../models/notification.models";
import { BaseRepository } from "../Implementation/base.repository";

export interface INotificationRepository
  extends Omit<BaseRepository<INotificationModel>, "model"> {
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
