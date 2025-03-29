import { inject, injectable } from "tsyringe";
import { IAdminService } from "../Interface/IAdminService";
import { IAdminRepository } from "../../repositories/Interface/IAdminRepository";

@injectable()
export default class adminService implements IAdminService {
  private adminRepository: IAdminRepository;

  private calculatePercentageChange(previous: number, current: number): number {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    const percentage = ((current - previous) / previous) * 100;
    return parseFloat(percentage.toFixed(2));
  }

  constructor(
    @inject("AdminRepository")
    adminRepository: IAdminRepository
  ) {
    this.adminRepository = adminRepository;
  }

  async getTotalUserCount(): Promise<{
    totalCount: number;
    currentMonthCount: number;
    percentChange: number;
  }> {
    const totalCount = await this.adminRepository.docsCount("role", "user");

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const currentMonthCount = await this.adminRepository.docsCountForMonth(
      "role",
      "user",
      currentYear,
      currentMonth
    );
    const previousMonthCount = await this.adminRepository.docsCountForMonth(
      "role",
      "user",
      prevYear,
      prevMonth
    );

    const percentChange = this.calculatePercentageChange(
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
    const totalCount = await this.adminRepository.docsCount("role", "trainer");

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const currentMonthCount = await this.adminRepository.docsCountForMonth(
      "role",
      "trainer",
      currentYear,
      currentMonth
    );
    const previousMonthCount = await this.adminRepository.docsCountForMonth(
      "role",
      "trainer",
      prevYear,
      prevMonth
    );

    const percentChange = this.calculatePercentageChange(
      previousMonthCount,
      currentMonthCount
    );

    return { totalCount, currentMonthCount, percentChange };
  }

  async getMonthlySubscriptionData(): Promise<
    { name: string; users: number; trainers: number }[]
  > {
    const monthlyData = await this.adminRepository.getMonthlySubscriptionData();
    return monthlyData;
  }
}
