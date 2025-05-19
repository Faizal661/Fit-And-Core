import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repository";
import { Types } from "mongoose";
import FoodLogModel, { IFoodLogModel } from "../../models/nutrition.models";
import { IFoodLogRepository } from "../Interface/IFoodLogRepository";

@injectable()
export class FoodLogRepository
  extends BaseRepository<IFoodLogModel>
  implements IFoodLogRepository
{
  constructor() {
    super(FoodLogModel);
  }

  async getByDateRange(userId: string, startDate: Date, endDate: Date): Promise<IFoodLogModel[]> {
    return FoodLogModel.find({
      userId: new Types.ObjectId(userId),
      consumedAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).exec();
  }
}
