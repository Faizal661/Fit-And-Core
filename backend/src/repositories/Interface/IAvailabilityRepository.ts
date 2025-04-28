import { BaseRepository } from "../Implementation/base.repository";
import { IAvailabilityModel } from "../../models/session.model/availability.models"; 

export interface IAvailabilityRepository 
  extends Omit<BaseRepository<IAvailabilityModel>, "model"> {

}