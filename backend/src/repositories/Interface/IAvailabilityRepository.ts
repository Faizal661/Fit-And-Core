import { BaseRepository } from "../Implementation/base.repository";
import { IAvailabilityModel } from "../../models/session.model/availability.models";
import { Types } from "mongoose";

export interface IAvailabilityRepository
  extends Omit<BaseRepository<IAvailabilityModel>, "model"> {
  findAvailabilitiesByTrainerAndDate(
    trainerId: Types.ObjectId,
    selectedDate: Date
  ): Promise<IAvailabilityModel[]>;
  findOverlappingAvailability(
    trainerId: Types.ObjectId,
    selectedDate: Date,
    startTime: string,
    endTime: string
  ): Promise<IAvailabilityModel | null>;
  findAvailabilitiesFromDate(
    trainerId: Types.ObjectId,
    startDate: Date 
  ): Promise<IAvailabilityModel[]> 
}
