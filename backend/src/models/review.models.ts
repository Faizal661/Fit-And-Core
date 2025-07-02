import { Schema, model, Types, Document } from "mongoose";
import { IReview } from "../types/review.types";

export interface IReviewModel extends Document, Omit<IReview, "_id"> {}

const reviewSchema = new Schema<IReviewModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trainerId: {
      type: Schema.Types.ObjectId,
      ref: "Trainer",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 500,
    }
  },
  { timestamps: true }
);

reviewSchema.index({ trainerId: 1, createdAt: -1 });


const ReviewModel = model<IReviewModel>("Review", reviewSchema);

export default ReviewModel;
