import { Types } from "mongoose";
import { IFoodLogModel } from "../../models/nutrition.models";

export interface IFoodLogService {
  createFoodLog(
    userId: Types.ObjectId,
    foodDescription: string,
    mealType: string,
    selectedDate:Date
  ): Promise<IFoodLogModel>;
  getFoodLogsByDate(userId: string, date: Date): Promise<IFoodLogModel[]>;
  getFoodLogDatesByMonth(userId: string, monthDate: Date): Promise<string[]>;
  deleteFoodLog(foodLogId: string, userId: string): Promise<void>
}
