import { Types } from "mongoose";

export interface IReport {
  bookingId: Types.ObjectId;
  reportedUserId: Types.ObjectId;
  reporterUserId: Types.ObjectId;
  message: string;
  reporterType: "trainer" | "trainee";
  status: "pending" | "in_review" | "resolved" | "rejected";
  resolutionDetails?:string;
  createdAt: Date;
  updatedAt: Date;
}
