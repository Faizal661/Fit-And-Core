import { injectable } from "tsyringe";
import UserModel, { IUserModel } from "../../models/user.models";
import { BaseRepository } from "./base.repository";
import { IUserRepository } from "../Interface/IUserRepository";
import { FilterQuery, Query, Types } from "mongoose";
import CustomError from "../../errors/CustomError";
import { HttpResCode } from "../../constants/http-response.constants";

@injectable()
export class UserRepository
  extends BaseRepository<IUserModel>
  implements IUserRepository
{
  constructor() {
    super(UserModel);
  }
  find(filter: FilterQuery<IUserModel>): Query<IUserModel[], IUserModel> {
    try {
      return this.model.find(filter);
    } catch (error) {
      throw new CustomError(
        "failed to find user",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async countDocuments(filter: FilterQuery<IUserModel>): Promise<number> {
    try {
      return this.model.countDocuments(filter);
    } catch (error) {
      throw new CustomError(
        "failed to fetch user counts",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
