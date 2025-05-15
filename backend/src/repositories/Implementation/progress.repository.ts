import { injectable } from "tsyringe";
import { BaseRepository } from "./base.repository";
import { Types } from "mongoose";
import ProgressModel, { IProgressModel } from "../../models/progress.models";
import { IProgressRepository } from "../Interface/IProgressRepository";

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
    return await this.model
      .find({ userId: traineeId })
      .sort({ date: 1 })
      .exec();
  }

  async addNewProgress(
    traineeId: Types.ObjectId,
    height: number,
    weight: number,
    bmi:number,
    bmiClass: string,
  ): Promise<IProgressModel> {
    const newProgression = new this.model({
      userId: traineeId,
      height,
      weight,
      bmi,
      bmiClass
    });
    try {
      console.log("🚀 ~ newProgression:", newProgression);
      return await newProgression.save();
    } catch (error) {
      console.error(error);
    }
    return await newProgression.save();
  }
}
