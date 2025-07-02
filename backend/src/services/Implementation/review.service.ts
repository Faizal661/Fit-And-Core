import { Document, Types } from "mongoose";
import { inject, injectable } from "tsyringe";
import CustomError from "../../errors/CustomError";
import { HttpResCode } from "../../constants/http-response.constants";
import { IReviewRepository } from "../../repositories/Interface/IReviewRepository";
import { IReviewModel } from "../../models/review.models";
import { IReviewService } from "../Interface/IReviewService";
import {
  RatingDistribution,
  ReviewDocument,
  TransformedReview,
} from "../../types/review.types";

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
    try {
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
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        "Failed to submit review",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getTrainerReviews(
    userId: Types.ObjectId,
    trainerId: Types.ObjectId,
    page = 1,
    limit = 10
  ): Promise<{
    reviews: TransformedReview[];
    myReview: boolean;
    ratingDistribution: RatingDistribution;
  }> {
    try {
      const myReview = (await this.reviewRepository.getMyReview(
        userId,
        trainerId
      )) as ReviewDocument | null;

      const reviews = (await this.reviewRepository.getReviewsByTrainer(
        userId,
        trainerId,
        page,
        limit
      )) as ReviewDocument[];

      const stats = await this.reviewRepository.getAverageRating(trainerId);

      const allReviews = [myReview, ...reviews];

      if (allReviews.length === 0) {
        return {
          reviews: [],
          myReview: false,
          ratingDistribution: stats,
        };
      }

      const transformedReviews: TransformedReview[] = allReviews
        .filter((rawReview) => rawReview !== null)
        .map((rawReview) => {
          const review = rawReview.toObject() as ReviewDocument;
          const { userId, ...restOfReview } = review;
          if (
            typeof userId === "object" &&
            userId !== null &&
            "username" in userId &&
            "profilePicture" in userId &&
            "_id" in userId
          ) {
            const { username, profilePicture, _id } = userId;
            return {
              userId: _id.toString(),
              username,
              profilePicture,
              ...restOfReview,
            };
          } else {
            return {
              userId: userId?.toString?.() ?? "",
              username: "",
              profilePicture: "",
              ...restOfReview,
            };
          }
        });

      return {
        reviews: transformedReviews,
        myReview: myReview ? true : false,
        ratingDistribution: stats,
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        "Failed to fetch trainer reviews",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateUserReview(
    userId: Types.ObjectId,
    reviewId: Types.ObjectId,
    updateData: Partial<IReviewModel>
  ): Promise<IReviewModel | null> {
    try {
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
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        "Failed to update review",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteUserReview(
    userId: Types.ObjectId,
    reviewId: Types.ObjectId
  ): Promise<void> {
    try {
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
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        "Failed to delete review",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
