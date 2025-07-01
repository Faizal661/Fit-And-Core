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
  userId: string;
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
export interface RatingDistribution {
  averageRating: number;
  totalReviews: number;
  fiveStarCount: number;
  fourStarCount: number;
  threeStarCount: number;
  twoStarCount: number;
  oneStarCount: number;
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
    userId: Types.ObjectId,
    trainerId: Types.ObjectId,
    page = 1,
    limit = 10
  ): Promise<{
    myReview: TransformedReview | null;
    reviews: TransformedReview[];
    ratingDistribution: RatingDistribution;
  }> {
    const myReview = (await this.reviewRepository.getMyReview(
      userId,
      trainerId
    )) as ReviewDocument;

    const transformedMyReview: TransformedReview | null = myReview
      ? {
          userId: myReview.userId.toString(),
          username:
            typeof myReview.userId === "object" && "username" in myReview.userId
              ? myReview.userId.username
              : "",
          profilePicture:
            typeof myReview.userId === "object" &&
            "profilePicture" in myReview.userId
              ? myReview.userId.profilePicture
              : "",
          _id: myReview._id,
          trainerId: myReview.trainerId,
          rating: myReview.rating,
          comment: myReview.comment,
          createdAt: myReview.createdAt,
          updatedAt: myReview.updatedAt,
          __v: myReview.__v,
        }
      : null;

    const reviews = (await this.reviewRepository.getReviewsByTrainer(
      userId,
      trainerId,
      page,
      limit
    )) as ReviewDocument[];

    const stats = await this.reviewRepository.getAverageRating(trainerId);

    const allReviews = [myReview, ...reviews];
    const transformedReviews: TransformedReview[] = allReviews.map(
      (rawReview) => {
        const review = rawReview.toObject ? rawReview.toObject() : rawReview;
        const { userId, ...restOfReview } = review;
        const { username, profilePicture, _id } = userId;

        return {
          userId: _id.toString(),
          username,
          profilePicture,
          ...restOfReview,
        };
      }
    );

    return {
      reviews: transformedReviews,
      myReview: transformedMyReview,
      ratingDistribution: stats
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
