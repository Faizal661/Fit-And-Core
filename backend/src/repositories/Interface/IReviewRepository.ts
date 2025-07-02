import { Types } from "mongoose";
import { IReviewModel } from "../../models/review.models";
import { BaseRepository } from "../Implementation/base.repository";
import { RatingDistribution, ReviewDocument } from "../../types/review.types";

export interface IReviewRepository
  extends Omit<BaseRepository<IReviewModel>, "model"> {
  getMyReview(
    userId: Types.ObjectId,
    trainerId: Types.ObjectId
  ): Promise<ReviewDocument | null>;
  getReviewsByTrainer(
    userId: Types.ObjectId,
    trainerId: Types.ObjectId,
    page: number,
    limit: number
  ): Promise<ReviewDocument[]>;
  getAverageRating(
    trainerId: Types.ObjectId
  ): Promise<RatingDistribution>;
}
