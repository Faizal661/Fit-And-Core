import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repository";
import { Types } from "mongoose";
import ReviewModel, { IReviewModel } from "../../models/review.models";
import { IReviewRepository } from "../Interface/IReviewRepository";
import { ReviewDocument } from "../../types/review.types";
import CustomError from "../../errors/CustomError";
import { HttpResCode } from "../../constants/http-response.constants";

@injectable()
export class ReviewRepository
  extends BaseRepository<IReviewModel>
  implements IReviewRepository
{
  constructor() {
    super(ReviewModel);
  }

  async getMyReview(
    userId: Types.ObjectId,
    trainerId: Types.ObjectId
  ): Promise<ReviewDocument | null> {
    try {
      return (await this.model
        .findOne({ userId, trainerId })
        .populate("userId", "username profilePicture")
        .sort({ createdAt: -1 })
        .exec()) as unknown as ReviewDocument;
    } catch (error) {
      throw new CustomError(
        "Failed to get my review",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getReviewsByTrainer(
    userId: Types.ObjectId,
    trainerId: Types.ObjectId,
    page = 1,
    limit = 10
  ): Promise<ReviewDocument[]> {
    try {
      const skip = (page - 1) * limit;

      return (await this.model
        .find({ trainerId, userId: { $ne: userId } })
        .populate("userId", "username profilePicture")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec()) as unknown as ReviewDocument[];
    } catch (error) {
      throw new CustomError(
        "Failed to get reviews by trainer",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAverageRating(trainerId: Types.ObjectId) {
    try {
      const result = await this.model.aggregate([
        { $match: { trainerId: new Types.ObjectId(trainerId) } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },

            fiveStarCount: {
              $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] },
            },
            fourStarCount: {
              $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] },
            },
            threeStarCount: {
              $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] },
            },
            twoStarCount: {
              $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] },
            },
            oneStarCount: {
              $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] },
            },
          },
        },
        {
          $project: {
            _id: 0,
            averageRating: 1,
            totalReviews: 1,
            fiveStarCount: 1,
            fourStarCount: 1,
            threeStarCount: 1,
            twoStarCount: 1,
            oneStarCount: 1,
            // fiveStarPercentage: { $cond: [ { $gt: ["$totalReviews", 0] }, { $multiply: [ { $divide: ["$fiveStarCount", "$totalReviews"] }, 100 ] }, 0 ] }
          },
        },
      ]);

      return (
        result[0] || {
          averageRating: 0,
          totalReviews: 0,
          fiveStarCount: 0,
          fourStarCount: 0,
          threeStarCount: 0,
          twoStarCount: 0,
          oneStarCount: 0,
        }
      );
    } catch (error) {
      throw new CustomError(
        "Failed to get average rating",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default new ReviewRepository();
