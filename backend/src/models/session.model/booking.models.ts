import mongoose, { Schema, Document, Types } from "mongoose";
import { IBooking } from"../../types/session.types";


export interface IBookingModel extends Document, IBooking {
  _id: Types.ObjectId;
}

const BookingSchema: Schema = new Schema(
  {
    slotId: { 
      type: Schema.Types.ObjectId, 
      ref: "Slot", 
      required: true 
    },
    trainerId: { 
      type: Schema.Types.ObjectId, 
      ref: "Trainer", 
      required: true 
    },
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    status: { 
      type: String, 
      enum: ["confirmed", "canceled", "completed"], 
      default: "confirmed" 
    },
    notes: { type: String },
  },
  { timestamps: true }
);

BookingSchema.index({ slotId: 1 });
BookingSchema.index({ userId: 1 });
BookingSchema.index({ trainerId: 1 });

export const BookingModel = mongoose.model<IBookingModel>(
  "Booking",
  BookingSchema
);

export default BookingModel;
