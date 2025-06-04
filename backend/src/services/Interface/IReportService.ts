import { IReportModel } from "../../models/report.models";

export interface IReportService {
  submitReport(data: Partial<IReportModel>): Promise<IReportModel>;
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
  getUserReports(
    userId: string,
    page: number,
    limit: number,
    status?: "pending" | "in_review" | "resolved" | "rejected"
  ): Promise<{
    reports: any[];
    totalReports: number;
    totalPages: number;
    currentPage: number;
  }>;
  updateReportStatus(
    id: string,
    status: string,
    resolutionDetails?: string
  ): Promise<IReportModel | null>;
}
