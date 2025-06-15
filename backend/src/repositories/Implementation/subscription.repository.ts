import { FilterQuery, ObjectId, Types } from "mongoose";
import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repository";
import { ISubscription } from "../../types/subscription.types";
import {
  SubscriptionModel,
  ISubscriptionModel,
} from "../../models/subscription.models";
import { ISubscriptionRepository } from "../../repositories/Interface/ISubscriptionRepository";
import { IUserModel } from "../../models/user.models";
import { ITrainerModel } from "../../models/trainer.models";

@injectable()
export class SubscriptionRepository
  extends BaseRepository<ISubscriptionModel>
  implements ISubscriptionRepository
{
  constructor() {
    super(SubscriptionModel);
  }

  async findActiveSubscribedTrainers(
    traineeId: Types.ObjectId
  ): Promise<Types.ObjectId[]> {
    const subscriptions = await SubscriptionModel.find({
      userId: traineeId,
      status: "active",
      expiryDate: { $gt: new Date() },
    })
      .populate({
        path: "trainerId",
        populate: {
          path: "userId",
          model: "User",
        },
      })
      .exec();

    return subscriptions
      .map((sub) => {
        const trainer = sub.trainerId as unknown as ITrainerModel;
        const user = trainer?.userId;
        return user && typeof user === "object" && "_id" in user
          ? user._id
          : null;
      })
      .filter((id): id is Types.ObjectId => id !== null);
  }

  async findActiveSubscribedTrainees(
    trainerId: Types.ObjectId
  ): Promise<Types.ObjectId[]> {
    const subscriptions = await SubscriptionModel.find({
      trainerId: trainerId,
      status: "active",
      expiryDate: { $gt: new Date() },
    });

    return subscriptions.map((sub) => sub.userId);
  }
}
