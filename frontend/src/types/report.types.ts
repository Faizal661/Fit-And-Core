export interface SubmitReportData {
  bookingId: string;
  reportedUserId: string;
  message: string;
  reporterType: string;
}

export interface ReportQueryParams {
  page: number;
  limit: number;
  status?: string;
}

export type ReportStatus = "pending" | "in_review" | "resolved" | "rejected";

export interface Report {
  _id: string;
  bookingId: string;
  reportedUserId: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  reporterUserId: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  reporterType: "trainer" | "trainee";
  message: string;
  resolutionDetails?: string;
  status: ReportStatus;
  createdAt: string;
}
export interface PaginatedReportsResponse {
  reports: Report[];
  totalReports: number;
  totalPages: number;
  currentPage: number;
}
