import { Request, Response, NextFunction } from "express";

export interface IStreakController {
  getOverallStreak(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getUserHeatmap(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  recordUserActivity(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
