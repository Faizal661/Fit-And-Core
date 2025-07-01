import { Types } from "mongoose";
import { IReviewModel } from "../../models/review.models";
import { RatingDistribution, TransformedReview } from "../Implementation/review.service";

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
    myReview: TransformedReview | null;
    reviews: TransformedReview[];
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
