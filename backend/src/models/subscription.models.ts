import mongoose, { Schema, Document, ObjectId, Types } from "mongoose";
import { ISubscripton } from "../types/subscription.types";

export interface ISubscriptonModel extends Document, ISubscripton {
  _id: Types.ObjectId;
}

const SubscriptonSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    trianerId: { type: Schema.Types.ObjectId, ref: "Trainer", required: true },
    planDuration: { type: String },
    amount: { type: Number },
    status: {
      type: String,
      enum: ["pending", "active", "cancelled", "expired"],
      default: "pending",
    },
    startDate: { type: Date },
    expiryDate: { type: Date },
    // paymentId: { type: Schema.Types.ObjectId, ref: "Payment" },
    paymentId: { type: String},
  },
  { timestamps: true }
);

SubscriptonSchema.index({ userId: 1, status: 1 });
SubscriptonSchema.index({ trianerId: 1, status: 1 });

export const SubscriptonModel = mongoose.model<ISubscriptonModel>(
  "Subscription",
  SubscriptonSchema
);

export default SubscriptonModel;
