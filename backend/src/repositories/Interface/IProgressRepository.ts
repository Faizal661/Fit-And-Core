import { IProgressModel } from "../../models/progress.models";
import { BaseRepository } from "../Implementation/base.repository";
import { Types } from "mongoose";

export interface IProgressRepository
  extends Omit<BaseRepository<IProgressModel>, "model"> {
  getTraineeProgression(
    traineeId: Types.ObjectId
  ): Promise<IProgressModel[]>;

  addNewProgress(
    traineeId: Types.ObjectId,
    height: number,
    weight: number,
    bmi:number,
    bmiClass: string,
  ): Promise<IProgressModel>;
}
