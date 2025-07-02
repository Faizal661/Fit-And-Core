import { inject, injectable } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { sendResponse } from "../../utils/send-response";
import {
  HttpResCode,
  HttpResMsg,
} from "../../constants/http-response.constants";
import { IReviewService } from "../../services/Interface/IReviewService";
import { IReviewController } from "../Interface/IReviewController";

@injectable()
export class ReviewController implements IReviewController {
  constructor(@inject("ReviewService") private reviewService: IReviewService) {}

  async submitReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { rating, comment, trainerId } = req.body;
      const review = await this.reviewService.submitReview(
        new Types.ObjectId(req.decoded?.id),
        new Types.ObjectId(trainerId),
        rating,
        comment
      );
      sendResponse(
        res,
        HttpResCode.CREATED,
        "Review submitted successfully",
        review
      );
    } catch (err) {
      next(err);
    }
  }

  async getTrainerReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, trainerId } = req.query;
      const result = await this.reviewService.getTrainerReviews(
        new Types.ObjectId(req.decoded?.id),
        new Types.ObjectId(trainerId as string),
        Number(page),
        Number(limit)
      );
      sendResponse(res, HttpResCode.OK, "Reviews fetched successfully", {
        result,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateReview(req: Request, res: Response, next: NextFunction) {
    try {
      const { rating, comment } = req.body;
      const updatedReview = await this.reviewService.updateUserReview(
        new Types.ObjectId(req.decoded?.id),
        new Types.ObjectId(req.params.reviewId),
        { rating, comment }
      );
      sendResponse(
        res,
        HttpResCode.OK,
        "Review updated successfully",
        updatedReview
      );
    } catch (err) {
      next(err);
    }
  }

  async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      await this.reviewService.deleteUserReview(
        new Types.ObjectId(req.decoded?.id),
        new Types.ObjectId(req.params.reviewId)
      );
      sendResponse(res, HttpResCode.OK, "Review deleted successfully");
    } catch (err) {
      next(err);
    }
  }
}
