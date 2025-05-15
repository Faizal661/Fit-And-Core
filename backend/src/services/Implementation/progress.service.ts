import { inject, injectable } from "tsyringe";
import { IProgressService } from "../Interface/IProgressService";
import { IProgressModel } from "../../models/progress.models";
import { IProgressRepository } from "../../repositories/Interface/IProgressRepository";
import { Types } from "mongoose";
import {
  HttpResCode,
  HttpResMsg,
} from "../../constants/http-response.constants";
import { CustomError } from "../../errors/CustomError";

@injectable()
export default class ProgressService implements IProgressService {
  private progressRepository: IProgressRepository;

  constructor(
    @inject("ProgressRepository")
    progressRepository: IProgressRepository
  ) {
    this.progressRepository = progressRepository;
  }

  private calculateBmiAndClass(
    height: number,
    weight: number
  ): { bmi: number; class: string } {
    const heightInMeters = height / 100;
    const bmi = parseFloat(
      (weight / (heightInMeters * heightInMeters)).toFixed(2)
    );
    let className: string;

    if (bmi < 18.5) {
      className = "underweight";
    } else if (bmi >= 18.5 && bmi < 25) {
      className = "normal";
    } else if (bmi >= 25 && bmi < 30) {
      className = "overweight";
    } else {
      className = "obese";
    }

    return { bmi, class: className };
  }

  async getTraineeProgressions(
    traineeId: Types.ObjectId
  ): Promise<IProgressModel[]> {
    try {
      const progressions = await this.progressRepository.getTraineeProgression(
        traineeId
      );
      return progressions;
    } catch (error) {
      throw new CustomError(
        HttpResMsg.FAILED_TO_FETCH_USER_PROGRESS,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async addNewProgress(
    traineeId: Types.ObjectId,
    height: number,
    weight: number
  ): Promise<IProgressModel> {
    try {
      const { bmi, class: calculatedClass } = this.calculateBmiAndClass(
        height,
        weight
      );

      const newProgression = await this.progressRepository.addNewProgress(
        traineeId,
        height,
        weight,
        bmi,
        calculatedClass,
      );
      console.log("🚀 ~ ProgressService ~ newProgression:", newProgression);
      return newProgression;
    } catch (error) {
      throw new CustomError(
        HttpResMsg.FAILED_TO_ADD_NEW_PROGRESS,
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
