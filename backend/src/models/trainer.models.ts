import { model,Schema,Document } from "mongoose";
import { ITrainer } from "../types/trainer.types";

export interface ITrainerModel extends Document, Omit<ITrainer, "_id"> {}

const trainerSchema = new Schema<ITrainerModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    specialization: { type: String, required: true },
    yearsOfExperience: { type: String, required: true },
    profilePicture: { type: String, required: true },
    about: { type: String, required: true },
    documentProofs: [{ type: String, required: true }],
    certifications: [{ type: String, required: true }],
    achievements: [{ type: String, required: true }],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reason: {
      type: String,
    },
  },
  { timestamps: true }
);

const TrainerModel = model<ITrainerModel>("Trainer", trainerSchema);

export default TrainerModel;
