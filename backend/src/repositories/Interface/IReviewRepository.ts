import { Types } from "mongoose";
import { IReviewModel } from "../../models/review.models";
import { BaseRepository } from "../Implementation/base.repository";
import { RatingDistribution } from "../../services/Implementation/review.service";

export interface IReviewRepository
  extends Omit<BaseRepository<IReviewModel>, "model"> {
  getMyReview(
    userId: Types.ObjectId,
    trainerId: Types.ObjectId
  ): Promise<IReviewModel | null>;
  getReviewsByTrainer(
    userId: Types.ObjectId,
    trainerId: Types.ObjectId,
    page: number,
    limit: number
  ): Promise<IReviewModel[]>;
  getAverageRating(
    trainerId: Types.ObjectId
  ): Promise<RatingDistribution>;
}
