import { Types } from "mongoose";
import { IReviewModel } from "../../models/review.models";
import { TransformedReview } from "../Implementation/review.service";

export interface IReviewService {
  submitReview(
    userId: Types.ObjectId,
    trainerId: Types.ObjectId,
    rating: number,
    comment: string
  ): Promise<IReviewModel>;
  getTrainerReviews(
    trainerId: Types.ObjectId,
    page: number,
    limit: number
  ): Promise<{
    reviews: TransformedReview[];
    averageRating: number;
    totalReviews: number;
  }>;
  updateUserReview(
    userId: Types.ObjectId,
    reviewId: Types.ObjectId,
    updateData: Partial<IReviewModel>
  ): Promise<IReviewModel|null>;
  deleteUserReview(
    userId: Types.ObjectId,
    reviewId: Types.ObjectId
  ): Promise<void>;
}
