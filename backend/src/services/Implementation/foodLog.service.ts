import { inject, injectable } from "tsyringe";
import { IFoodLogService } from "../Interface/IFoodLogService";
import { IFoodLogModel } from "../../models/nutrition.models";
import { IFoodLogRepository } from "../../repositories/Interface/IFoodLogRepository";
import { Types } from "mongoose";
import {
  HttpResCode,
  HttpResMsg,
} from "../../constants/http-response.constants";
import { CustomError } from "../../errors/CustomError";
import { IGeminiService } from "../Interface/IGeminiApiService";
import { MealType } from "../../types/nutrition.types";

@injectable()
export default class FoodLogService implements IFoodLogService {
  private foodLogRepository: IFoodLogRepository;
  private geminiService: IGeminiService;

  constructor(
    @inject("FoodLogRepository")
    foodLogRepository: IFoodLogRepository,
    @inject("GeminiService")
    geminiService: IGeminiService
  ) {
    this.foodLogRepository = foodLogRepository;
    this.geminiService = geminiService;
  }

  async createFoodLog(
    userId: Types.ObjectId,
    foodDescription: string,
    mealType: string,
    selectedDate: Date
  ): Promise<IFoodLogModel> {
    try {
      const parsedFoods = await this.geminiService.parseFoodDescription(
        foodDescription
      );

      const nutrition = await this.geminiService.getNutrition(foodDescription);

      const validMealTypes: MealType[] = [
        "breakfast",
        "lunch",
        "dinner",
        "snacks",
        "other",
      ];
      if (!validMealTypes.includes(mealType as MealType)) {
        throw new Error(`Invalid meal type: ${mealType}`);
      }

      const foodLogData = {
        userId: new Types.ObjectId(userId),
        mealType: mealType as MealType,
        foodDescription,
        parsedFoods,
        nutrition,
        consumedAt: selectedDate,
      };

      const savedLog = await this.foodLogRepository.create(foodLogData);
      return savedLog;
    } catch (error: any) {
      console.error(`Could not create food log: ${error.message}`);
      if (error instanceof CustomError) {
        throw error;
      } else {
        throw new CustomError(
          "Failed to add food log!",
          HttpResCode.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  async getFoodLogsByDate(
    userId: string,
    date: Date
  ): Promise<IFoodLogModel[]> {
    try {
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      return this.foodLogRepository.getByDateRange(
        userId,
        startOfDay,
        endOfDay
      );
    } catch (error: unknown) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        throw new CustomError(
          "Failed to fetch food logs!",
          HttpResCode.INTERNAL_SERVER_ERROR
        );
      }
    }
  }
}
