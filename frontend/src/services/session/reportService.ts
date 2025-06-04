import api from "../../config/axios.config";
import {
  ReportQueryParams,
  PaginatedReportsResponse ,
  SubmitReportData,
  ReportStatus,
} from "../../types/report.types";

export const submitReport = async (data: SubmitReportData) => {
  const response = await api.post("/reports", data);
  return response.data;
};

export const getReports = async (
  params: ReportQueryParams
): Promise<PaginatedReportsResponse> => {
  const response = await api.get<PaginatedReportsResponse>("/reports", {
    params: {
      page: params.page,
      limit: params.limit,
      ...(params.status &&
        params.status !== "all" && { status: params.status }),
    },
  });
  return response.data;
};

export const updateReportStatus = async (reportId: string, status: ReportStatus,resolutionDetails?:string): Promise<void> => {
    const response = await api.patch(`/reports/${reportId}/status`, { status, resolutionDetails });
    return response.data;
};
