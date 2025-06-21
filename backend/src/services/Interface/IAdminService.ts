import { IUserModel } from "../../models/user.models";
import { FinanceData } from "../../types/finance.types";

export interface IAdminService {
  getTotalUserCount(): Promise<{
    totalCount: number;
    currentMonthCount: number;
    percentChange: number;
  }>;
  getTotalTrainerCount(): Promise<{
    totalCount: number;
    currentMonthCount: number;
    percentChange: number;
  }>;
  getMonthlySubscriptionData(): Promise<
    { name: string; users: number; trainers: number }[]
  >;
  getFinanceAnalytics(start: Date, end: Date): Promise<FinanceData>;
}
