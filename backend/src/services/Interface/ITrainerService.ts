import { TrainerApplicationData } from "../../types/trainer.types";

export interface ITrainerService {
  applyTrainer(data: TrainerApplicationData): Promise<any>;
  approveTrainer(trainerId: string): Promise<any>;
  getTrainerApplications(isApproved?: boolean): Promise<any>;
}