import mongoose, { Schema, Document, Types } from "mongoose";
import { IProgress } from"../types/progress.types";

export interface IProgressModel extends Document, IProgress {
  _id: Types.ObjectId;
}

const ProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    height: {
      type: Number,
      required: true,
      min: 100,
      max: 300,
    },
    weight: {
      type: Number,
      required: true,
      min: 30,
      max: 300,
    },
    bmi: {
      type: Number,
      required: true,
    },
    bmiClass: {
      type: String,
      enum: ["underweight", "normal", "overweight", "obese"],
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const ProgressModel = mongoose.model<IProgressModel>(
  "Progress",
  ProgressSchema
);

export default ProgressModel;
