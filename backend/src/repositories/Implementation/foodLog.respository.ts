import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repository";
import { Types } from "mongoose";
import FoodLogModel, { IFoodLogModel } from "../../models/nutrition.models";
import { IFoodLogRepository } from "../Interface/IFoodLogRepository";
import CustomError from "../../errors/CustomError";
import { HttpResCode } from "../../constants/http-response.constants";

@injectable()
export class FoodLogRepository
  extends BaseRepository<IFoodLogModel>
  implements IFoodLogRepository
{
  constructor() {
    super(FoodLogModel);
  }

  async getByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<IFoodLogModel[]> {
    try {
      return FoodLogModel.find({
        userId: new Types.ObjectId(userId),
        consumedAt: {
          $gte: startDate,
          $lte: endDate,
        },
      }).exec();
    } catch (error) {
      throw new CustomError(
        "failed to fetch foodlogs by date ",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
