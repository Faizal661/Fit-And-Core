import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import {
  HttpResCode,
  HttpResMsg,
} from "../../constants/http-response.constants";
import { IAdminController } from "../Interface/IAdminController";
import { IAdminService } from "../../services/Interface/IAdminService";
import { sendResponse } from "../../utils/send-response";

@injectable()
export default class AdminController implements IAdminController {
  private adminService: IAdminService;

  constructor(
    @inject("AdminService")
    adminService: IAdminService
  ) {
    this.adminService = adminService;
  }

  async userCount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userData = await this.adminService.getTotalUserCount();
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, userData);
    } catch (error) {
      next(error);
    }
  }

  async trainerCount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const trainerData = await this.adminService.getTotalTrainerCount();
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, trainerData);
    } catch (error) {
      next(error);
    }
  }

  async getMonthlySubscriptionData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const monthlyData = await this.adminService.getMonthlySubscriptionData();
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, { monthlyData });
    } catch (error) {
      next(error);
    }
  }

  async getFinanceAnalytics(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        sendResponse(res, 400, "startDate and endDate are required");
      }
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        sendResponse(res, 400, "Invalid date format");
      }

      const financeData = await this.adminService.getFinanceAnalytics(
        start,
        end
      );
      sendResponse(res, 200, "Finance analytics fetched", { financeData });
    } catch (error) {
      next(error);
    }
  }

  
}
