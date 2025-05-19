import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { sendResponse } from "../../utils/send-response";
import {
  HttpResCode,
  HttpResMsg,
} from "../../constants/http-response.constants";
import { CustomError } from "../../errors/CustomError";
import { IFoodLogService } from "../../services/Interface/IFoodLogService";
import { IFoodLogController } from "../Interface/IFoodLogController";
import { Types } from "mongoose";

@injectable()
export class FoodLogController implements IFoodLogController {
  private foodLogService: IFoodLogService;

  constructor(
    @inject("FoodLogService")
    foodLogService: IFoodLogService
  ) {
    this.foodLogService = foodLogService;
  }

  async getFoodLogsByDate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { traineeId } = req.params;
      const dateString = req.query.date as string;

      if (!traineeId) {
        throw new CustomError(HttpResMsg.BAD_REQUEST, HttpResCode.BAD_REQUEST);
      }

      if (!dateString) {
        throw new CustomError(
          "Date is required in YYYY-MM-DD format",
          HttpResCode.BAD_REQUEST
        );
      }

      const date = new Date(dateString);
      const foodLogs = await this.foodLogService.getFoodLogsByDate(
        traineeId,
        date
      );
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, { foodLogs });
    } catch (error) {
      next(error);
    }
  }

  async createFoodLog(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.decoded?.id;
      if (!userId) {
        throw new CustomError(
          HttpResMsg.UNAUTHORIZED,
          HttpResCode.UNAUTHORIZED
        );
      }

      const { foodDescription, mealType, selectedDate=new Date() } = req.body;
      if (!foodDescription || !mealType ) {
        throw new CustomError(
          "Food description and meal type are required",
          HttpResCode.BAD_REQUEST
        );
      }

      const newfoodLog = await this.foodLogService.createFoodLog(
        new Types.ObjectId(userId),
        foodDescription,
        mealType,
        selectedDate
      );
      sendResponse(
        res,
        HttpResCode.CREATED,
        HttpResMsg.CREATED,
        {newfoodLog}
      );
    } catch (error) {
      next(error);
    }
  }
}
