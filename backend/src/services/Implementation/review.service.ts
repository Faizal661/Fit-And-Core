import { Document, Types } from "mongoose";
import { inject, injectable } from "tsyringe";
import CustomError from "../../errors/CustomError";
import { HttpResCode } from "../../constants/http-response.constants";
import { IReviewRepository } from "../../repositories/Interface/IReviewRepository";
import { IReviewModel } from "../../models/review.models";
import { IReviewService } from "../Interface/IReviewService";

export interface ReviewDocument extends Document {
  _id: Types.ObjectId;
  userId:
    | {
        _id: Types.ObjectId;
        username: string;
        profilePicture: string;
      }
    | Types.ObjectId;
  trainerId: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface TransformedReview {
  username: string;
  profilePicture: string;
  _id: Types.ObjectId;
  trainerId: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

@injectable()
export class ReviewService implements IReviewService {
  constructor(
    @inject("ReviewRepository") private reviewRepository: IReviewRepository
  ) {}

  async submitReview(
    userId: Types.ObjectId,
    trainerId: Types.ObjectId,
    rating: number,
    comment: string
  ): Promise<IReviewModel> {
    const existingReview = await this.reviewRepository.findOne({
      userId,
      trainerId,
    });
    if (existingReview) {
      throw new CustomError(
        "You have already reviewed this trainer",
        HttpResCode.BAD_REQUEST
      );
    }

    return await this.reviewRepository.create({
      userId,
      trainerId,
      rating,
      comment,
    });
  }

  async getTrainerReviews(
    trainerId: Types.ObjectId,
    page = 1,
    limit = 10
  ): Promise<{
    reviews: TransformedReview[];
    averageRating: number;
    totalReviews: number;
  }> {
    const reviews = (await this.reviewRepository.getReviewsByTrainer(
      trainerId,
      page,
      limit
    )) as ReviewDocument[];

    const stats = await this.reviewRepository.getAverageRating(trainerId);

    const transformedReviews: TransformedReview[] = reviews.map((rawReview) => {
      const review = rawReview.toObject ? rawReview.toObject() : rawReview;
      const { userId, ...restOfReview } = review;
      const { username, profilePicture } = userId;

      return {
        username,
        profilePicture,
        ...restOfReview,
      };
    });

    return {
      reviews: transformedReviews,
      averageRating: stats.averageRating,
      totalReviews: stats.count,
    };
  }

  async updateUserReview(
    userId: Types.ObjectId,
    reviewId: Types.ObjectId,
    updateData: Partial<IReviewModel>
  ): Promise<IReviewModel | null> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new CustomError("Review not found", HttpResCode.NOT_FOUND);
    }

    if (review.userId.toString() !== userId.toString()) {
      throw new CustomError(
        "You can only update your own reviews",
        HttpResCode.BAD_REQUEST
      );
    }

    return await this.reviewRepository.update(reviewId, updateData);
  }

  async deleteUserReview(
    userId: Types.ObjectId,
    reviewId: Types.ObjectId
  ): Promise<void> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new CustomError("Review not found", HttpResCode.NOT_FOUND);
    }

    if (review.userId.toString() !== userId.toString()) {
      throw new CustomError(
        "You can only delete your own reviews",
        HttpResCode.BAD_REQUEST
      );
    }

    await this.reviewRepository.delete(reviewId);
  }
}
