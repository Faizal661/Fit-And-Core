import { ITrainerModel } from "../../models/trainer.models";
import { PaginatedTraineesResult,TraineeData } from "../../types/trainee.types";
import { TrainerApplicationData } from "../../types/trainer.types";

export interface ITrainerService {
  applyTrainer(data: TrainerApplicationData): Promise<ITrainerModel>;
  getApplicationStatus(userId: string): Promise<{ status: string; reason?: string }>;
  rejectTrainer(trainerId: string, reason: string): Promise<ITrainerModel>;
  approveTrainer(trainerId: string): Promise<ITrainerModel>;
  getTrainerApplications(isApproved?: boolean): Promise<ITrainerModel[]>;
  getApprovedTrainers(): Promise<ITrainerModel[]>;
  getOneTrainerDetails(trainerId: string): Promise<ITrainerModel>;
  getSubscribedTrainersDetails(userId:string):Promise<ITrainerModel[]>;
  getMyTrainees(
    page: number,
    limit: number,
    search: string,
    trainerUserId: string
  ): Promise<PaginatedTraineesResult>
  getTraineeDetails(traineeId:string,trainerUserId:string): Promise<TraineeData>
}