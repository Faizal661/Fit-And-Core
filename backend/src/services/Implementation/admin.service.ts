import { inject, injectable } from "tsyringe";
import { IAdminService } from "../Interface/IAdminService";
import { IAdminRepository } from "../../repositories/Interface/IAdminRepository";

@injectable()
export default class adminService implements IAdminService {
  private adminRepository: IAdminRepository;

  constructor(
    @inject("AdminRepository")
    adminRepository: IAdminRepository
  ) {
    this.adminRepository = adminRepository;
  }

  async userCount(): Promise<number> {
    const userCount = await this.adminRepository.docsCount('role','user')
    return userCount;
  }

  async trainerCount(): Promise<number>{
    const userCount = await this.adminRepository.docsCount('role','trainer')
    return userCount;
  }

  async getMonthlySubscriptionData(): Promise<
  { name: string; users: number; trainers: number }[]
> {
  const monthlyData = await this.adminRepository.getMonthlySubscriptionData();
  return monthlyData;
}

}
