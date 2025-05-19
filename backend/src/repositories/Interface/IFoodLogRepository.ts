import { IFoodLogModel } from "../../models/nutrition.models";
import { BaseRepository } from "../Implementation/base.repository";
import { Types } from "mongoose";

export interface IFoodLogRepository
  extends Omit<BaseRepository<IFoodLogModel>, "model"> {
    getByDateRange(userId: string, startDate: Date, endDate: Date): Promise<IFoodLogModel[]>
}
