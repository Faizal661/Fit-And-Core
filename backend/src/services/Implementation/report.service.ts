import { inject, injectable } from "tsyringe";
import { IReportService } from "../Interface/IReportService";
import { IReportRepository } from "../../repositories/Interface/IReportRepository";
import { ITrainerRepository } from "../../repositories/Interface/ITrainerRepository";
import { IReportModel } from "../../models/report.models";
import { Types } from "mongoose";
import { CustomError } from "../../errors/CustomError";
import { HttpResCode } from "../../constants/http-response.constants";

@injectable()
export class ReportService implements IReportService {
  constructor(
    @inject("ReportRepository") private reportRepository: IReportRepository,
    @inject("TrainerRepository") private trainerRepository: ITrainerRepository
  ) {}

  async submitReport(data: Partial<IReportModel>): Promise<IReportModel> {
    if (
      !data.bookingId ||
      !data.reportedUserId ||
      !data.reporterUserId ||
      !data.message ||
      !data.reporterType
    ) {
      throw new CustomError(
        "Missing required report data fields.",
        HttpResCode.BAD_REQUEST
      );
    }

    let finalReportedUserId: Types.ObjectId;
    let finalReporterUserId: Types.ObjectId;

    if (data.reporterType === "trainee") {
      const trainerDoc = await this.trainerRepository.findById(
        data.reportedUserId
      );

      if (!trainerDoc) {
        throw new CustomError(
          "Reported trainer not found.",
          HttpResCode.NOT_FOUND
        );
      }
      finalReportedUserId = trainerDoc.userId;
      finalReporterUserId = data.reporterUserId;
    } else if (data.reporterType === "trainer") {
      finalReportedUserId = data.reportedUserId;
      finalReporterUserId = data.reporterUserId;
    } else {
      throw new CustomError("Invalid reporter type.", HttpResCode.BAD_REQUEST);
    }

    const reportData: IReportModel = {
      ...data,
      reporterUserId: finalReporterUserId,
      reportedUserId: finalReportedUserId,
    } as IReportModel;
    return await this.reportRepository.create(reportData);
  }

  async getPaginatedReports(
    page: number,
    limit: number,
    status?: "pending" | "in_review" | "resolved" | "rejected"
  ): Promise<{
    reports: any[];
    totalReports: number;
    totalPages: number;
    currentPage: number;
  }> {
    return await this.reportRepository.getPaginatedReports(page, limit, status);
  }

  async getUserReports(userId: string): Promise<IReportModel[]> {
    return await this.reportRepository.find({
      reporterUserId: new Types.ObjectId(userId),
    });
  }

  async updateReportStatus(
    id: string,
    status: "pending" | "in_review" | "resolved" | "rejected",
    resolutionDetails?: string
  ): Promise<IReportModel | null> {
    return await this.reportRepository.update(new Types.ObjectId(id), {
      status,
      resolutionDetails,
    });
  }
}
