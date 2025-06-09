import {
  NotificationModel,
  INotificationModel,
} from "../../models/notification.models";
import { Types } from "mongoose";
import { BaseRepository } from "./base.repository";
import { INotificationRepository } from "../Interface/INotificationRepository";

export class NotificationRepository
  extends BaseRepository<INotificationModel>
  implements INotificationRepository
{
   constructor() {
     super(NotificationModel);
   }

  async findByUserId(
    userId: string,
    readStatus?: boolean
  ): Promise<INotificationModel[]> {
    const query: { userId: Types.ObjectId; read?: boolean } = {
      userId: new Types.ObjectId(userId),
    };
    if (readStatus !== undefined) {
      query.read = readStatus;
    }
    return NotificationModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async markAsRead(
    notificationId: string,
    userId: string
  ): Promise<INotificationModel | null> {
    return NotificationModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(notificationId),
        userId: new Types.ObjectId(userId),
      },
      { read: true },
      { new: true }
    ).exec();
  }

  async markAllAsRead(userId: string): Promise<number> {
    const result = await NotificationModel.updateMany(
      { userId: new Types.ObjectId(userId), read: false },
      { read: true }
    ).exec();
    return result.modifiedCount;
  }
}
