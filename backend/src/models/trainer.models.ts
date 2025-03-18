import mongoose, { Document, Schema, Types } from "mongoose";

export interface ITrainerModel extends Document {
  userId: Types.ObjectId;
  username: string;
  email: string;
  phone: string;
  specialization: string;
  yearsOfExperience: string;
  about: string;
  documentProofs: string[];
  certifications: string[];
  achievements: string[];
  isApproved: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const trainerSchema = new Schema<ITrainerModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    specialization: { type: String, required: true },
    yearsOfExperience: { type: String, required: true },
    about: { type: String, required: true },
    documentProofs: [{ type: String, required: true }],
    certifications: [{ type: String, required: true }],
    achievements: [{ type: String, required: true }],
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const TrainerModel = mongoose.model<ITrainerModel>("Trainer", trainerSchema);

export default TrainerModel;
