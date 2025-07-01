import { Types } from "mongoose";

export interface IReview {
  userId: Types.ObjectId;
  trainerId: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}
