
import { injectable } from "tsyringe";
import UserModel, { IUserModel } from "../../models/user.models";
import { BaseRepository } from "./base.repository";
import { IUserRepository } from "../Interface/IUserRepository";

@injectable()
export class UserRepository
  extends BaseRepository<IUserModel>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }

 
}