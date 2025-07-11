import { inject, injectable } from "tsyringe";
import { Server } from "socket.io";
import { NotificationRepository } from "../../repositories/Implementation/notification.repository";
import {
  INotification,
  INotificationModel,
  NotificationType,
} from "../../models/notification.models";
import { ITrainerRepository } from "../../repositories/Interface/ITrainerRepository";
import { INotificationService } from "../Interface/INotificationService";
import CustomError from "../../errors/CustomError";
import {
  HttpResCode,
  HttpResMsg,
} from "../../constants/http-response.constants";
import { INotificationRepository } from "../../repositories/Interface/INotificationRepository";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject("NotificationRepository")
    private notificationRepository: INotificationRepository,
    @inject("TrainerRepository")
    private trainerRepository: ITrainerRepository,
    @inject("SocketIOServer")
    private io: Server
  ) {}

  async sendNotification(
    notificationData: INotification
  ): Promise<INotificationModel> {
    try {
      let finalNotificationUserId = notificationData.userId;
      if (notificationData.userType === "Trainer") {
        const trainer = await this.trainerRepository.findById(
          notificationData.userId
        );

        if (!trainer) {
          throw new CustomError(
            HttpResMsg.TRAINER_NOT_FOUND,
            HttpResCode.INTERNAL_SERVER_ERROR
          );
        }

        finalNotificationUserId = trainer?.userId;
      }

      const newNotification = await this.notificationRepository.create({
        ...notificationData,
        userId: finalNotificationUserId,
      });

      this.io
        .to(finalNotificationUserId.toString())
        .emit("newNotification", newNotification);

      return newNotification;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        "Failed to send notification: ",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getNotifications(
    userId: string,
    unreadOnly: boolean = false
  ): Promise<INotificationModel[]> {
    try {
      return this.notificationRepository.findByUserId(
        userId,
        unreadOnly ? false : undefined
      );
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        "Failed to fetch notifications: ",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async markNotificationAsRead(
    notificationId: string,
    userId: string
  ): Promise<INotificationModel | null> {
    try {
      return this.notificationRepository.markAsRead(notificationId, userId);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        "Failed to mark notification as read: ",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async markAllNotificationsAsRead(userId: string): Promise<number> {
    try {
      return this.notificationRepository.markAllAsRead(userId);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        "Failed to mark all notifications as read:",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
