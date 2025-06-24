import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { sendResponse } from "../../utils/send-response";
import { IStreakController } from "../Interface/IStreakController";
import { IStreakService } from "../../services/Interface/IStreakService";
import CustomError from "../../errors/CustomError";
import { HttpResCode } from "../../constants/http-response.constants";

@injectable()
export class StreakController implements IStreakController {
  constructor(@inject("StreakService") private streakService: IStreakService) {}

  async getOverallStreak(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.decoded?.id;

      if (!userId) {
        throw new CustomError(
          "Unauthorized: User ID is required.",
          HttpResCode.UNAUTHORIZED
        );
      }

      const overallStreakData = await this.streakService.getOverallStreakData(
        userId
      );
      sendResponse(res, 200, "Overall streak data retrieved successfully", {
        overallStreakData,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserHeatmap(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.decoded?.id;
      const year = req.query.year
        ? parseInt(req.query.year as string)
        : new Date().getFullYear();

      if (!userId) {
        throw new CustomError(
          "Unauthorized: User ID is required.",
          HttpResCode.UNAUTHORIZED
        );
      }

      if (isNaN(year)) {
        throw new CustomError(
          "Invalid year parameter.",
          HttpResCode.BAD_REQUEST
        );
      }

      const heatmapData = await this.streakService.getHeatmapData(userId, year);
      sendResponse(res, 200, "Heatmap data retrieved successfully", {
        heatmapData,
      });
    } catch (error) {
      next(error);
    }
  }


  async recordUserActivity(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.decoded?.id;
      const { activityDate, pointsToAward } = req.body;

      if (!userId) {
        throw new CustomError(
          "Unauthorized: User ID is required.",
          HttpResCode.UNAUTHORIZED
        );
      }

      const date = activityDate ? new Date(activityDate) : new Date();
      const points = pointsToAward ? parseInt(pointsToAward as string) : 5; 

      if (isNaN(date.getTime())) {
        sendResponse(res, 400, "Invalid activityDate provided.");
        return;
      }
      if (isNaN(points) || points <= 0) {
        sendResponse(
          res,
          400,
          "Invalid pointsToAward. Must be a positive number."
        );
        return;
      }

      await this.streakService.recordActivityAndHandleStreak(
        userId,
        date,
        points
      );
      sendResponse(
        res,
        200,
        "Activity recorded and points awarded successfully."
      );
    } catch (error) {
      next(error);
    }
  }
}
