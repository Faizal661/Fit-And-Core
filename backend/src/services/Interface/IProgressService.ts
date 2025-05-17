import { Types } from "mongoose";
import { IProgressModel } from "../../models/progress.models";

export interface IProgressService {
    getTraineeProgressions(traineeId: Types.ObjectId): Promise<IProgressModel[]>;
    addNewProgress(
      traineeId: Types.ObjectId,
      height: number,
      weight: number
    ): Promise<IProgressModel>;
}