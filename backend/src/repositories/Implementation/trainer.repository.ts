import { injectable } from "tsyringe";
import TrainerModel, { ITrainerModel } from "../../models/trainer.models";
import { BaseRepository } from "./base.repository";
import { ITrainerRepository } from "../Interface/ITrainerRepository";
import { FilterQuery } from "mongoose";
import CustomError from "../../errors/CustomError";
import { HttpResCode } from "../../constants/http-response.constants";

@injectable()
export class TrainerRepository
  extends BaseRepository<ITrainerModel>
  implements ITrainerRepository
{
  constructor() {
    super(TrainerModel);
  }

  async findApprovedTrainers(
    filter: FilterQuery<ITrainerModel>,
    skip: number = 0,
    limit: number = 10
  ): Promise<ITrainerModel[]> {
    try {
      let query = this.model.find(filter);

      if (skip > 0) {
        query = query.skip(skip);
      }
      if (limit > 0) {
        query = query.limit(limit);
      }

      return query.exec();
    } catch (error) {
      throw new CustomError(
        "Failed to find approved trainers",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async countDocuments(filter: FilterQuery<ITrainerModel>): Promise<number> {
    try {
      return this.model.countDocuments(filter).exec();
    } catch (error) {
      throw new CustomError(
        "Failed to count approved trainer documents",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
