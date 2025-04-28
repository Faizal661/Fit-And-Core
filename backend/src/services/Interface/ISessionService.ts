import { Types } from "mongoose";
import { CreateAvailabilityParams } from "../../types/session.types";
import { IAvailabilityModel } from "../../models/session.model/availability.models";
import { ISlotModel } from "../../models/session.model/slot.models";

export interface ISessionService {
  createAvailability(params: CreateAvailabilityParams): Promise<{
    availability: IAvailabilityModel;
    slots: ISlotModel[];
  }>;
  getTrainerAvailability(trainerId: string): Promise<IAvailabilityModel[]>;
  deleteAvailability(availabilityId: string): Promise<boolean>;
}