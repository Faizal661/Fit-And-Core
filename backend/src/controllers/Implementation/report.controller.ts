import { inject, injectable } from "tsyringe";
import { IReportController } from "../Interface/IReportController";
import { IReportService } from "../../services/Interface/IReportService";
import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { sendResponse } from "../../utils/send-response";
import {
  HttpResCode,
  HttpResMsg,
} from "../../constants/http-response.constants";

@injectable()
export class ReportController implements IReportController {
  constructor(@inject("ReportService") private reportService: IReportService) {}

  async newReport(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { bookingId, reportedUserId, message, reporterType } = req.body;
      const reporterUserId = req.decoded?.id;
      if (!reporterUserId) {
        sendResponse(res, HttpResCode.BAD_REQUEST, "User ID is required");
        return;
      }
      const report = await this.reportService.submitReport({
        bookingId,
        reportedUserId,
        reporterUserId: new Types.ObjectId(reporterUserId),
        message,
        reporterType,
      });
      sendResponse(res, HttpResCode.CREATED, HttpResMsg.SUCCESS, report);
    } catch (error) {
      next(error);
    }
  }

  async getAllReports(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page = parseInt((req.query.page as string) || "1", 10);
      const limit = parseInt((req.query.limit as string) || "10", 10);
      const status =
        req.query.status && req.query.status !== "all"
          ? (req.query.status as
              | "pending"
              | "in_review"
              | "resolved"
              | "rejected")
          : undefined;

      const result = await this.reportService.getPaginatedReports(
        page,
        limit,
        status
      );

      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, result);
    } catch (error) {
      next(error);
    }
  }

  async getUserReports(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.decoded?.id;
      if (!userId) {
        sendResponse(res, HttpResCode.BAD_REQUEST, "User ID is required");
        return;
      }

      const page = parseInt((req.query.page as string) || "1", 10);
      const limit = parseInt((req.query.limit as string) || "10", 10);
      const status =
        req.query.status && req.query.status !== "all"
          ? (req.query.status as
              | "pending"
              | "in_review"
              | "resolved"
              | "rejected")
          : undefined;

      const result = await this.reportService.getUserReports(
        userId,
        page,
        limit,
        status
      );
      console.log("🚀 ~ ReportController ~ result:", result)
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, result);
    } catch (error) {
      next(error);
    }
  }

  async updateReportStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { status, resolutionDetails } = req.body;

      const updated = await this.reportService.updateReportStatus(
        id,
        status,
        resolutionDetails
      );
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, updated);
    } catch (error) {
      next(error);
    }
  }
}
