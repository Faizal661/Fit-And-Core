import { FilterQuery } from "mongoose";
import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repository";
import { ISubscription} from "../../types/subscription.types";
import { SubscriptionModel ,ISubscriptionModel } from "../../models/subscription.models";
import { ISubscriptionRepository } from "../../repositories/Interface/ISubscriptionRepository";

@injectable()
export class SubscriptionRepository
  extends BaseRepository<ISubscriptionModel>
  implements ISubscriptionRepository
{
  constructor() {
    super(SubscriptionModel);
  }
 
}
