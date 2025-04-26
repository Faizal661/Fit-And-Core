import { BaseRepository } from "../Implementation/base.repository";
import { ISubscriptionModel } from "../../models/subscription.models";
import { FilterQuery } from "mongoose";

export interface ISubscriptionRepository
  extends Omit<BaseRepository<ISubscriptionModel>, "model"> {

}
