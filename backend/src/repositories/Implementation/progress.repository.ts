import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repository";
import { Types } from "mongoose";
import ProgressModel, { IProgressModel } from "../../models/progress.models";
import { IProgressRepository } from "../Interface/IProgressRepository";
import { HttpResCode } from "../../constants/http-response.constants";
import CustomError from "../../errors/CustomError";

@injectable()
export class ProgressRepository
  extends BaseRepository<IProgressModel>
  implements IProgressRepository
{
  constructor() {
    super(ProgressModel);
  }

  async getTraineeProgression(
    traineeId: Types.ObjectId
  ): Promise<IProgressModel[]> {
    try {
      return await this.model
        .find({ userId: traineeId })
        .sort({ createdAt: 1 })
        .exec();
    } catch (error) {
      throw new CustomError(
        "failed to find trainee progressions",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async addNewProgress(
    traineeId: Types.ObjectId,
    height: number,
    weight: number,
    bmi: number,
    bmiClass: string
  ): Promise<IProgressModel> {
    try {
      const newProgression = new this.model({
        userId: traineeId,
        height,
        weight,
        bmi,
        bmiClass,
      });
      try {
        return await newProgression.save();
      } catch (error) {
        console.error(error);
      }
      return await newProgression.save();
    } catch (error) {
      throw new CustomError(
        "failed to add new progress",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
