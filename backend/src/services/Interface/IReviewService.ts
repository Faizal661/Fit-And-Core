import { Types } from "mongoose";
import { IReviewModel } from "../../models/review.models";
import { RatingDistribution, TransformedReview } from "../../types/review.types";

export interface IReviewService {
  submitReview(
    userId: Types.ObjectId,
    trainerId: Types.ObjectId,
    rating: number,
    comment: string
  ): Promise<IReviewModel>;
  getTrainerReviews(
    userId: Types.ObjectId,
    trainerId: Types.ObjectId,
    page: number,
    limit: number
  ): Promise<{
    myReview: boolean;
    reviews: TransformedReview[] | null;
    ratingDistribution: RatingDistribution;
  }>;
  updateUserReview(
    userId: Types.ObjectId,
    reviewId: Types.ObjectId,
    updateData: Partial<IReviewModel>
  ): Promise<IReviewModel | null>;
  deleteUserReview(
    userId: Types.ObjectId,
    reviewId: Types.ObjectId
  ): Promise<void>;
}
