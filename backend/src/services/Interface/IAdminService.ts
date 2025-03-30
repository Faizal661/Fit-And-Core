import { IUserModel } from "../../models/user.models";

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
}
