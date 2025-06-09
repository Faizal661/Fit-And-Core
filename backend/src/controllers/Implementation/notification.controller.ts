import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { NotificationService } from "../../services/Implementation/notification.service";
import {
  HttpResCode,
  HttpResMsg,
} from "../../constants/http-response.constants";
import { sendResponse } from "../../utils/send-response";
import { INotificationController } from "../Interface/INotificationController";

@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject("NotificationService")
    private notificationService: NotificationService
  ) {}

  async getNotifications(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.userId;
      const unreadOnly = req.query.unreadOnly === "true";
      const notifications = await this.notificationService.getNotifications(
        userId,
        unreadOnly
      );
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, { notifications });
    } catch (error) {
      next(error);
    }
  }

  async markNotificationAsRead(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.userId;
      const notificationId = req.params.notificationId;
      const notification =
        await this.notificationService.markNotificationAsRead(
          notificationId,
          userId
        );
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, { notification });
    } catch (error) {
      next(error);
    }
  }

  async markAllNotificationsAsRead(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.userId;
      const modifiedCount =
        await this.notificationService.markAllNotificationsAsRead(userId);
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, { modifiedCount });
    } catch (error) {
      next(error);
    }
  }
}
