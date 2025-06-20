import {
  NotificationModel,
  INotificationModel,
} from "../../models/notification.models";
import { Types } from "mongoose";
import { BaseRepository } from "./base.repository";
import { INotificationRepository } from "../Interface/INotificationRepository";
import { CustomError } from "../../errors/CustomError";
import { HttpResCode } from "../../constants/http-response.constants";

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
    try {
      const query: { userId: Types.ObjectId; read?: boolean } = {
        userId: new Types.ObjectId(userId),
      };
      if (readStatus !== undefined) {
        query.read = readStatus;
      }
      return NotificationModel.find(query).sort({ createdAt: -1 }).exec();
    } catch (error) {
      throw new CustomError(
        "failed to find user",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async markAsRead(
    notificationId: string,
    userId: string
  ): Promise<INotificationModel | null> {
    try {
      return NotificationModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(notificationId),
          userId: new Types.ObjectId(userId),
        },
        { read: true },
        { new: true }
      ).exec();
    } catch (error) {
      throw new CustomError(
        "failed to mark as read notification",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async markAllAsRead(userId: string): Promise<number> {
     try {
       const result = await NotificationModel.updateMany(
         { userId: new Types.ObjectId(userId), read: false },
         { read: true }
       ).exec();
       return result.modifiedCount;
    } catch (error) {
      throw new CustomError(
        "failed to mark as read all notification",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
