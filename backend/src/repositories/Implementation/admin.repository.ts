import { inject, injectable } from "tsyringe";
import UserModel, { IUserModel } from "../../models/user.models";
import { BaseRepository } from "./base.repository";
import { IAdminRepository } from "../Interface/IAdminRepository";

@injectable()
export class AdminRepository
  extends BaseRepository<IUserModel>
  implements IAdminRepository
{
  constructor() {
    super(UserModel );
  }

  async docsCount(field:string,value:string): Promise<number> {
    console.log('repo reached - - - --')
    const docsCount = await this.model.countDocuments({ [field]: value });
    console.log('repo response - - - --',docsCount)
    return docsCount;
  }

}
 