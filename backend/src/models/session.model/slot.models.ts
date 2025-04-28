import mongoose, { Schema, Document, Types } from "mongoose";
import { ISlot } from "../../types/session.types";

export interface ISlotModel extends Document, Omit<ISlot, "_id"> {}

const SlotSchema: Schema = new Schema(
  {
    availabilityId: {
      type: Schema.Types.ObjectId,
      ref: "Availability",
      required: true,
    },
    trainerId: {
      type: Schema.Types.ObjectId,
      ref: "Trainer",
      required: true,
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: {
      type: String,
      enum: ["available", "booked", "canceled"],
      default: "available",
    },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking" },
  },
  { timestamps: true }
);

SlotSchema.index({ availabilityId: 1 });
SlotSchema.index({ trainerId: 1, status: 1 });
SlotSchema.index({ status: 1 });

export const SlotModel = mongoose.model<ISlotModel>("Slot", SlotSchema);

export default SlotModel;
