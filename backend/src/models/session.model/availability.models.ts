import mongoose, { Schema, Document, Types } from "mongoose";
import { IAvailability } from "../../types/session.types";

export interface IAvailabilityModel extends Document, IAvailability {
  _id: Types.ObjectId;
}

const AvailabilitySchema: Schema = new Schema(
  {
    trainerId: { type: Schema.Types.ObjectId, ref: "Trainer", required: true },
    selectedDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    slotDuration: { type: Number, required: true },
  },
  { timestamps: true }
);

AvailabilitySchema.index({ trainerId: 1, selectedDate: 1 });

export const AvailabilityModel = mongoose.model<IAvailabilityModel>(
  "Availability",
  AvailabilitySchema
);

export default AvailabilityModel;