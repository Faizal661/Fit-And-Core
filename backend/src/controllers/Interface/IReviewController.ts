import { Request, Response, NextFunction } from "express";

export interface IReviewController {
  submitReview(req: Request, res: Response, next: NextFunction): Promise<void>;
  getTrainerReviews(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  updateReview(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteReview(req: Request, res: Response, next: NextFunction): Promise<void>;
}
