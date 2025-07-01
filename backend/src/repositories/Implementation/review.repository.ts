import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repository";
import { Types } from "mongoose";
import ReviewModel, { IReviewModel } from "../../models/review.models";
import { IReviewRepository } from "../Interface/IReviewRepository";

@injectable()
export class ReviewRepository extends BaseRepository<IReviewModel> implements IReviewRepository{
  constructor() {
    super(ReviewModel);
  }

  async getReviewsByTrainer(
    trainerId: Types.ObjectId,
    page = 1,
    limit = 10
  ): Promise<IReviewModel[]> {
    const skip = (page - 1) * limit;

    return await this.find({ trainerId })
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
          count: { $sum: 1 },
        },
      },
    ]);

    return result[0] || { averageRating: 0, count: 0 };
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
