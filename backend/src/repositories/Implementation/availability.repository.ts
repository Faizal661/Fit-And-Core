import { FilterQuery } from "mongoose";
import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repository";
import AvailabilityModel, { IAvailabilityModel } from "../../models/session.model/availability.models"; 
import { IAvailabilityRepository } from "../Interface/IAvailabilityRepository";

@injectable()
export class AvailabilityRepository
  extends BaseRepository<IAvailabilityModel>
  implements IAvailabilityRepository
{
  constructor() {
    super(AvailabilityModel);
  }
 
}
