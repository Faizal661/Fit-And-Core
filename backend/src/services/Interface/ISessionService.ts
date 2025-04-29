import { Types } from "mongoose";
import { CreateAvailabilityParams } from "../../types/session.types";
import { IAvailabilityModel } from "../../models/session.model/availability.models";
import { ISlotModel } from "../../models/session.model/slot.models";

type GroupedAvailabilities = Record<string, IAvailabilityModel[]>;

export interface ISessionService {
  createAvailability(params: CreateAvailabilityParams): Promise<{
    availability: IAvailabilityModel;
    slots: ISlotModel[];
  }>;
  getAvailabilitiesByDate(userId:string, dateString:string): Promise<IAvailabilityModel[]>;
  getUpcomingAvailabilitiesGrouped(
    userId: string,
    startDateString: string
  ): Promise<GroupedAvailabilities> ;
  // deleteAvailability(availabilityId: string): Promise<boolean>;

  // getTrainerAvailability(trainerId: string): Promise<IAvailabilityModel[]>;
}