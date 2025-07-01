import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repository";
import { Types } from "mongoose";
import ReviewModel, { IReviewModel } from "../../models/review.models";
import { IReviewRepository } from "../Interface/IReviewRepository";

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
  ): Promise<IReviewModel | null> {
    return await this.model
      .findOne({ userId, trainerId })
      .populate("userId", "username profilePicture")
      .sort({ createdAt: -1 });
  }

  async getReviewsByTrainer(
    userId: Types.ObjectId,
    trainerId: Types.ObjectId,
    page = 1,
    limit = 10
  ): Promise<IReviewModel[]> {
    const skip = (page - 1) * limit;

    return await this.find({ trainerId, userId: { $ne: userId } })
      .populate("userId", "username profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  async getAverageRating(trainerId: Types.ObjectId) {
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
  }

  //   async getUserReviewForTrainer(
  //     userId: Types.ObjectId,
  //     trainerId: Types.ObjectId
  //   ) {
  //     return await this.model.findOne({ userId, trainerId }).lean();
  //   }

  //   async updateReview(
  //     reviewId: Types.ObjectId,
  //     updateData: Partial<IReviewModel>
  //   ) {
  //     return await this.model
  //       .findByIdAndUpdate(reviewId, updateData, { new: true })
  //       .lean();
  //   }

  //   async deleteReview(reviewId: Types.ObjectId) {
  //     return await this.model.findByIdAndDelete(reviewId);
  //   }
}

export default new ReviewRepository();
