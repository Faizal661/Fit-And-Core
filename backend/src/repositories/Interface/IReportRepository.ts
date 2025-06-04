import { IReportModel } from "../../models/report.models";
import { BaseRepository } from "../Implementation/base.repository";

export interface IReportRepository
  extends Omit<BaseRepository<IReportModel>, "model"> {
  getPaginatedReports(
    page: number,
    limit: number,
    status?: "pending" | "in_review" | "resolved" | "rejected"
  ): Promise<{
    reports: any[];
    totalReports: number;
    totalPages: number;
    currentPage: number;
  }>;
}
