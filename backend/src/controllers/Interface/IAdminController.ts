import { NextFunction, Request, Response } from "express";

export interface IAdminController {
  userCount(req: Request, res: Response, next: NextFunction): Promise<void>;
  trainerCount(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMonthlySubscriptionData(req: Request,res: Response, next: NextFunction ): Promise<void>;
}
