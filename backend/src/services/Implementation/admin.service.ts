import { inject, injectable } from "tsyringe";
import { IAdminService } from "../Interface/IAdminService";
import { IAdminRepository } from "../../repositories/Interface/IAdminRepository";
import { FinanceData } from "../../types/finance.types";
import { ISubscriptionRepository } from "../../repositories/Interface/ISubscriptionRepository";
import { CustomError } from "../../errors/CustomError";
import { HttpResCode } from "../../constants/http-response.constants";

@injectable()
export default class AdminService implements IAdminService {
  constructor(
    @inject("AdminRepository")
    private _adminRepository: IAdminRepository,
    @inject("SubscriptionRepository")
    private _subscriptionRepository: ISubscriptionRepository
  ) {}

  async getTotalUserCount(): Promise<{
    totalCount: number;
    currentMonthCount: number;
    percentChange: number;
  }> {
    const totalCount = await this._adminRepository.docsCount("role", "user");

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const currentMonthCount = await this._adminRepository.docsCountForMonth(
      "role",
      "user",
      currentYear,
      currentMonth
    );
    const previousMonthCount = await this._adminRepository.docsCountForMonth(
      "role",
      "user",
      prevYear,
      prevMonth
    );

    const percentChange = this._calculatePercentageChange(
      previousMonthCount,
      currentMonthCount
    );

    return { totalCount, currentMonthCount, percentChange };
  }

  async getTotalTrainerCount(): Promise<{
    totalCount: number;
    currentMonthCount: number;
    percentChange: number;
  }> {
    const totalCount = await this._adminRepository.docsCount("role", "trainer");

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const currentMonthCount = await this._adminRepository.docsCountForMonth(
      "role",
      "trainer",
      currentYear,
      currentMonth
    );
    const previousMonthCount = await this._adminRepository.docsCountForMonth(
      "role",
      "trainer",
      prevYear,
      prevMonth
    );

    const percentChange = this._calculatePercentageChange(
      previousMonthCount,
      currentMonthCount
    );

    return { totalCount, currentMonthCount, percentChange };
  }

  async getMonthlySubscriptionData(): Promise<
    { name: string; users: number; trainers: number }[]
  > {
    const monthlyData =
      await this._adminRepository.getMonthlySubscriptionData();
    return monthlyData;
  }

  async getFinanceAnalytics(start: Date, end: Date): Promise<FinanceData> {
    try {
      return this._subscriptionRepository.getFinanceAnalytics(start, end);
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        "Failed to fetch financial analytics",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  private _calculatePercentageChange(
    previous: number,
    current: number
  ): number {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    const percentage = ((current - previous) / previous) * 100;
    return parseFloat(percentage.toFixed(2));
  }
}
