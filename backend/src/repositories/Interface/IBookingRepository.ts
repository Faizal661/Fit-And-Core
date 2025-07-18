import { BaseRepository } from "../Implementation/base.repository";
import BookingModel, {
  IBookingModel,
} from "../../models/session.model/booking.models";
import { Types } from "mongoose";
import { BookingDetails, BookingsResponse } from "../../types/booking.types";

export interface IBookingRepository
  extends Omit<BaseRepository<IBookingModel>, "model"> {
  findUpcomingBookingsByTrainer(
    trainerId: Types.ObjectId,
    currentDate: Date
  ): Promise<IBookingModel[]>;

  findAllBookingsByUserAndTrainer(
    userId: Types.ObjectId,
    trainerId: Types.ObjectId
  ): Promise<BookingDetails[]>;

  findAllBookingsByUser(
    userId: Types.ObjectId,
    page:number,
    limit:number
  ): Promise<BookingsResponse>;

  getBookingDetailsById(bookingId: Types.ObjectId): Promise<IBookingModel>;

  findUpcomingBookingsBetween(
    start: Date,
    end: Date
  ): Promise<BookingDetails[]>;

  countUserBookingsInPeriod(
    userId: Types.ObjectId,
    trainerId: Types.ObjectId,
    start: Date,
    end: Date
  ): Promise<number>;
}
