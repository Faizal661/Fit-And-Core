import mongoose, { Schema, Document, ObjectId, Types } from "mongoose";
import { ISubscription } from "../types/subscription.types";

export interface ISubscriptionModel extends Document, ISubscription {
  _id: Types.ObjectId;
}

const SubscriptionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    trainerId: { type: Schema.Types.ObjectId, ref: "Trainer", required: true },
    planDuration: { type: String },
    amount: { type: Number },
    status: {
      type: String,
      enum: ["pending", "active", "refunded", "expired"],
      default: "pending",
    },
    startDate: { type: Date },
    expiryDate: { type: Date },
    // paymentId: { type: Schema.Types.ObjectId, ref: "Payment" },
    paymentId: { type: String},
    sessions: { type: Number, default: 10 },
  },
  { timestamps: true }
);

SubscriptionSchema.index({ userId: 1, status: 1 });
SubscriptionSchema.index({ trainerId: 1, status: 1 });

export const SubscriptionModel = mongoose.model<ISubscriptionModel>(
  "Subscription",
  SubscriptionSchema
);

export default SubscriptionModel;
