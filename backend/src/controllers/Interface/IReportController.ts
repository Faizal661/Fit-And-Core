import { Request, Response, NextFunction } from "express";

export interface IReportController {
  newReport(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAllReports(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUserReports(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateReportStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
}