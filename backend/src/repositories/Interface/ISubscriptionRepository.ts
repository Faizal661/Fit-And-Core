import { BaseRepository } from "../Implementation/base.repository";
import { ISubscriptonModel } from "../../models/subscription.models";
import { FilterQuery } from "mongoose";

export interface ISubscriptionRepository
  extends Omit<BaseRepository<ISubscriptonModel>, "model"> {

}
