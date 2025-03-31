import { BaseRepository } from "../Implementation/base.repository";
import { IUserModel } from "../../models/user.models";
import { FilterQuery, Query } from "mongoose";
export interface IUserRepository
  extends Omit<BaseRepository<IUserModel>, "model"> {
  find(filter: FilterQuery<IUserModel>): Query<IUserModel[], IUserModel>;
  // Add countDocuments method
  countDocuments(filter: FilterQuery<IUserModel>): Promise<number>;
}
