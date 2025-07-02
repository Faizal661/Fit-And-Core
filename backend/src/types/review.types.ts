import { Document, Types } from "mongoose";

export interface IReview {
  userId: Types.ObjectId;
  trainerId: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

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
