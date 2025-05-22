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
      
      const currentDate = new Date();
      currentDate.setHours(23, 59, 59, 999);

      if (selectedDate > currentDate) {
        throw new CustomError(
          "Cannot add food logs for future dates. Please select today's date or a past date.",
          HttpResCode.BAD_REQUEST
        );
      }

      const parsedFoods = await this.geminiService.parseFoodDescription(foodDescription);
      const nutrition = await this.geminiService.getNutrition(parsedFoods);

      const validMealTypes: MealType[] = [
        "breakfast",
        "lunch",
        "dinner",
        "snacks",
      ];
      if (!validMealTypes.includes(mealType as MealType)) {
        throw new CustomError(
          `Invalid meal type: ${mealType}`,
          HttpResCode.BAD_REQUEST
        );
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
    } catch (error: unknown) {
      console.error(`Could not create food log: ${error}`);
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

  async getFoodLogDatesByMonth(
    userId: string,
    monthDate: Date,
  ): Promise<string[]> {
    try {
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth();

      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);

      const foodLogs = await this.foodLogRepository.getByDateRange(userId, startDate, endDate);

      const loggedDates = new Set<string>();
      foodLogs.forEach(log => {
        const dateString = log.consumedAt.toISOString().split('T')[0];
        loggedDates.add(dateString);
      });

      return Array.from(loggedDates);
    } catch (error: any) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        throw new CustomError(
          'Failed to retrieve food log dates',
          HttpResCode.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  async deleteFoodLog(foodLogId: string, userId: string): Promise<void> {
    const foodLogObjectId = new Types.ObjectId(foodLogId);
    const userObjectId = new Types.ObjectId(userId);

    const foodLog = await this.foodLogRepository.findById(foodLogObjectId);
    if (!foodLog) {
      throw new CustomError(
        HttpResMsg.FOOD_LOG_NOT_FOUND,
        HttpResCode.NOT_FOUND
      );
    }

    if (foodLog.userId.toString() !== userObjectId.toString()) {
      throw new CustomError(HttpResMsg.FORBIDDEN, HttpResCode.FORBIDDEN);
    }

    await this.foodLogRepository.delete(foodLogObjectId);
  }
}
