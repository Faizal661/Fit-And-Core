import { ITrainerModel } from "../../models/trainer.models";
import { TrainerApplicationData } from "../../types/trainer.types";

export interface ITrainerService {
  applyTrainer(data: TrainerApplicationData): Promise<ITrainerModel>;
  rejectTrainer(trainerId: string, reason: string): Promise<any>;
  getApplicationStatus(userId: string): Promise<{ status: string; reason?: string }>;
  approveTrainer(trainerId: string): Promise<any>;
  getTrainerApplications(isApproved?: boolean): Promise<any>;
}