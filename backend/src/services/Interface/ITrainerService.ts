import { ITrainerModel } from "../../models/trainer.models";
import { TrainerApplicationData } from "../../types/trainer.types";

export interface ITrainerService {
  applyTrainer(data: TrainerApplicationData): Promise<ITrainerModel>;
  getApplicationStatus(userId: string): Promise<{ status: string; reason?: string }>;
  rejectTrainer(trainerId: string, reason: string): Promise<ITrainerModel>;
  approveTrainer(trainerId: string): Promise<ITrainerModel>;
  getTrainerApplications(isApproved?: boolean): Promise<ITrainerModel[]>;
  getApprovedTrainers(): Promise<ITrainerModel[]>;
  getOneTrainerDetails(trainerId: string): Promise<ITrainerModel>;
}