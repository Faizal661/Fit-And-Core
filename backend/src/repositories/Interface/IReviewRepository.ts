import { Types } from "mongoose";
import { IReviewModel } from "../../models/review.models";
import { BaseRepository } from "../Implementation/base.repository";

export interface IReviewRepository
  extends Omit<BaseRepository<IReviewModel>, "model"> {
    getReviewsByTrainer(trainerId: Types.ObjectId, page: number, limit: number) : Promise<IReviewModel[]>
    getAverageRating(trainerId: Types.ObjectId) : Promise<{ averageRating: number; count: number }>;
}
