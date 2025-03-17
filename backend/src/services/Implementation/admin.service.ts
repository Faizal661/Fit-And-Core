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
    console.log('service reach -  - -  --')
    const userCount = await this.adminRepository.docsCount('role','user')
    console.log("service count ->", userCount);
    return userCount;
  }

  async trainerCount(): Promise<number>{
    console.log('service reach -  - -  --')
    const userCount = await this.adminRepository.docsCount('role','trainer')
    console.log("service count ->", userCount);
    return userCount;
  }

}
