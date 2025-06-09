import { NextFunction, Request, Response } from "express";

export interface INotificationController {
  getNotifications ( req: Request,res: Response,next: NextFunction ): Promise<void>;
  markNotificationAsRead ( req: Request,res: Response,next: NextFunction ): Promise<void>;
  markAllNotificationsAsRead ( req: Request,res: Response,next: NextFunction ): Promise<void>;
}
