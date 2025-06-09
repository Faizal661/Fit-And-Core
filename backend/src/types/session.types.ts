import { Types } from "mongoose";

export interface IAvailability {
  _id?: Types.ObjectId;
  trainerId: Types.ObjectId;
  selectedDate: Date;
  startTime: string;
  endTime: string;
  slotDuration: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateAvailabilityParams {
  userId: string;
  selectedDate: Date;
  startTime: string;
  endTime: string;
  slotDuration: number;
}

export interface ISlot {
  _id?: Types.ObjectId;
  availabilityId: Types.ObjectId;
  trainerId: Types.ObjectId;
  slotDate: Date;
  startTime: string;
  endTime: string;
  status: "available" | "booked" | "canceled";
  bookingId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBooking {
  _id?: Types.ObjectId;
  trainerId: Types.ObjectId;
  userId: Types.ObjectId;
  slotId: Types.ObjectId;
  status: "confirmed" | "canceled" | "completed";
  notes?: string;
  trainerVideoUrl: string | null;
  traineeVideoUrl: string | null;
  trainerVideoUploadedAt: Date | null;
  traineeVideoUploadedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IVideoSession {
  bookingId: string;
  trainerSocketId?: string;
  traineeSocketId?: string;
  status: "pending" | "active" | "ended";
  endedAt?: Date;
  createdAt: Date;
}
