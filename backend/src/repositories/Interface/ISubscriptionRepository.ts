import { BaseRepository } from "../Implementation/base.repository";
import { ISubscriptionModel } from "../../models/subscription.models";
import { FilterQuery, Types } from "mongoose";
import { FinanceData } from "../../types/finance.types";
import { SubscriptionsResponse } from "../../types/subscription.types";

export interface ISubscriptionRepository
  extends Omit<BaseRepository<ISubscriptionModel>, "model"> {
  getFinanceAnalytics(start: Date, end: Date): Promise<FinanceData>;
refundSubscription(subscriptionId: Types.ObjectId): Promise<ISubscriptionModel | null>
findAllSubscriptionsByUser(
    userId: Types.ObjectId,
    page:number,
    limit:number
  ): Promise<SubscriptionsResponse>;
}
