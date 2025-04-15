import { FilterQuery } from "mongoose";
import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repository";
import { ISubscripton} from "../../types/subscription.types";
import { SubscriptonModel ,ISubscriptonModel } from "../../models/subscription.models";
import { ISubscriptionRepository } from "../../repositories/Interface/ISubscriptionRepository";

@injectable()
export class SubscriptionRepository
  extends BaseRepository<ISubscriptonModel>
  implements ISubscriptionRepository
{
  constructor() {
    super(SubscriptonModel);
  }
 
}
