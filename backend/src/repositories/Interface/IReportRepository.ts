import { IReportModel } from "../../models/report.models";
import { BaseRepository } from "../Implementation/base.repository";

export interface IReportRepository
  extends Omit<BaseRepository<IReportModel>, "model"> {
  getPaginatedReports(
    page: number,
    limit: number,
    status?: "pending" | "in_review" | "resolved" | "rejected"
  ): Promise<{
    reports: IReportModel[];
    totalReports: number;
    totalPages: number;
    currentPage: number;
  }>;
  getPaginatedUserReports(
    userId: string,
    page: number,
    limit: number,
    status?: "pending" | "in_review" | "resolved" | "rejected"
  ): Promise<{
    reports: IReportModel[];
    totalReports: number;
    totalPages: number;
    currentPage: number;
  }>;
}
