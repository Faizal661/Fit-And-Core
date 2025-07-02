import { BaseRepository } from "../Implementation/base.repository";
import { ITrainerModel } from "../../models/trainer.models";
import { FilterQuery } from "mongoose";

export interface ITrainerRepository
  extends Omit<BaseRepository<ITrainerModel>, "model"> {
  findApprovedTrainers(
    filter: FilterQuery<ITrainerModel>,
    skip: number ,
    limit: number 
  ): Promise<ITrainerModel[]>;

  countDocuments(filter: FilterQuery<ITrainerModel>): Promise<number>;
}
