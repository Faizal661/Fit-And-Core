import mongoose, { Schema, Document } from "mongoose";
import { IVideoSession } from "../../types/session.types";

export interface IVideoSessionModel
  extends Document,
    Omit<IVideoSession, "_id"> {}

const VideoSessionSchema = new Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    trainerSocketId: String,
    traineeSocketId: String,
    status: {
      type: String,
      enum: ["pending", "active", "ended"],
      default: "pending",
    },
    endedAt: Date,
  },
  { timestamps: true }
);

export const VideoSessionModel = mongoose.model<IVideoSessionModel>(
  "VideoSession",
  VideoSessionSchema
);
