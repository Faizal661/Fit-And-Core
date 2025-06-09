import { Schema, model, Types, Document } from "mongoose";
import { IReport } from "../types/report.types";

export interface IReportModel extends Document, Omit<IReport, "_id"> {}

const ReportSchema = new Schema<IReportModel>(
  {
    bookingId: { type: Schema.Types.ObjectId, required: true, ref: "Booking" },
    reportedUserId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    reporterUserId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    reporterType: {
      type: String,
      enum: ["trainer", "trainee"],
      required: true,
    },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "in_review", "resolved", "rejected"],
      default: "pending",
    },
    resolutionDetails: {
      type: String,
    },
  },
  { timestamps: true }
);

const ReportModel = model<IReportModel>("Report", ReportSchema);

export default ReportModel;
