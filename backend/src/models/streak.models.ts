import mongoose, { Schema, Document, Types } from "mongoose";
import { IDailyActivityCount, IUserStreak } from "../types/streak.types";

export interface IUserStreakModel extends Document, Omit<IUserStreak, "_id"> {}

const DailyActivityCountSchema = new Schema<IDailyActivityCount>(
  {
    date: { type: Date, required: true },
    points: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const UserStreakSchema = new Schema<IUserStreakModel>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    dailyActivityCounts: { type: [DailyActivityCountSchema], default: [] },
    lastActivityDate: { type: Date, required: false },
    userPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

UserStreakSchema.index({ userId: 1 });

export const UserStreakModel = mongoose.model<IUserStreakModel>(
  "UserStreak",
  UserStreakSchema
);
export default UserStreakModel;
