import { BaseRepository } from "../Implementation/base.repository";
import BookingModel, { IBookingModel } from "../../models/session.model/booking.models";
import { Types } from "mongoose";

export interface IBookingRepository 
  extends Omit<BaseRepository<IBookingModel>, "model"> {

    findUpcomingBookingsByTrainer(
        trainerId: Types.ObjectId,
        currentDate: Date 
      ): Promise<IBookingModel[]>

      findAllBookingsByUserAndTrainer(
        userId: Types.ObjectId,  
        trainerId: Types.ObjectId 
      ): Promise<any[]>
}