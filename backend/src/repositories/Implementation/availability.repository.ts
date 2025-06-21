import { FilterQuery, Types } from "mongoose";
import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repository";
import AvailabilityModel, {
  IAvailabilityModel,
} from "../../models/session.model/availability.models";
import { IAvailabilityRepository } from "../Interface/IAvailabilityRepository";
import { CustomError } from "../../errors/CustomError";
import { HttpResCode } from "../../constants/http-response.constants";

@injectable()
export class AvailabilityRepository
  extends BaseRepository<IAvailabilityModel>
  implements IAvailabilityRepository
{
  constructor() {
    super(AvailabilityModel);
  }

  async findAvailabilitiesByTrainerAndDate(
    trainerId: Types.ObjectId,
    selectedDate: Date
  ): Promise<IAvailabilityModel[]> {
    try {
      const startOfDayUTC = new Date(selectedDate);
      startOfDayUTC.setUTCHours(0, 0, 0, 0);

      const endOfDayUTC = new Date(startOfDayUTC);
      endOfDayUTC.setUTCDate(startOfDayUTC.getUTCDate() + 1);

      const filter: FilterQuery<IAvailabilityModel> = {
        trainerId: trainerId,
        selectedDate: {
          $gte: startOfDayUTC,
          $lt: endOfDayUTC,
        },
      };

      return this.model.find(filter).exec();
    } catch (error) {
      throw new CustomError(
        "failed to find availabilities of trainer",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOverlappingAvailability(
    trainerId: Types.ObjectId,
    selectedDate: Date,
    startTime: string,
    endTime: string
  ): Promise<IAvailabilityModel | null> {
     try {
       const startOfDayUTC = new Date(selectedDate);
       startOfDayUTC.setUTCHours(0, 0, 0, 0);
   
       const endOfDayUTC = new Date(startOfDayUTC);
       endOfDayUTC.setUTCDate(startOfDayUTC.getUTCDate() + 1);
   
       const filter: FilterQuery<IAvailabilityModel> = {
         trainerId: trainerId,
         selectedDate: {
           $gte: startOfDayUTC,
           $lt: endOfDayUTC,
         },
         $and: [{ startTime: { $lt: endTime } }, { endTime: { $gt: startTime } }],
       };
       return this.model.findOne(filter).exec();
    } catch (error) {
      throw new CustomError(
        "failed to find overlapping availabilities",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAvailabilitiesFromDate(
    trainerId: Types.ObjectId,
    startDate: Date
  ): Promise<IAvailabilityModel[]> {
       try {
         const startOfStartDateUTC = new Date(startDate);
         startOfStartDateUTC.setUTCHours(0, 0, 0, 0);
     
         const filter: FilterQuery<IAvailabilityModel> = {
           trainerId: trainerId,
           selectedDate: {
             $gte: startOfStartDateUTC,
           },
         };
     
         return this.model
           .find(filter)
           .sort({
             selectedDate: 1,
             startTime: 1,
           })
           .exec();
    } catch (error) {
      throw new CustomError(
        "failed to find availabilities from date",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
