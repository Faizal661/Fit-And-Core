
import { injectable } from "tsyringe";
import UserModel, { IUserModel } from "../../models/user.models";
import { BaseRepository } from "./base.repository";
import { IUserRepository } from "../Interface/IUserRepository";
import { FilterQuery, Query } from "mongoose";

@injectable()
export class UserRepository
  extends BaseRepository<IUserModel>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }
  // Override find to return a Query object
  find(filter: FilterQuery<IUserModel>): Query<IUserModel[], IUserModel> {
    return this.model.find(filter);
  }

  // Implement countDocuments
  async countDocuments(filter: FilterQuery<IUserModel>): Promise<number> {
    return this.model.countDocuments(filter);
  }
 
}