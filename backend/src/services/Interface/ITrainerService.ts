import { ITrainerModel } from "../../models/trainer.models";
import {
  PaginatedTraineesResult,
  TraineeData,
} from "../../types/trainee.types";
import {
  trainersWithRatings,
  TrainerApplicationData,
  SubscribedTrainerWithExpiry,
  GetApprovedTrainersResponse,
} from "../../types/trainer.types";

export interface ITrainerService {
  applyTrainer(data: TrainerApplicationData): Promise<ITrainerModel>;
  getApplicationStatus(
    userId: string
  ): Promise<{ status: string; reason?: string }>;
  rejectTrainer(trainerId: string, reason: string): Promise<ITrainerModel>;
  approveTrainer(trainerId: string): Promise<ITrainerModel>;
  getTrainerApplications(isApproved?: boolean): Promise<ITrainerModel[]>;
  getApprovedTrainers(
    specialization: string,
    page: number,
    limit: number,
    searchTerm: string,
  ): Promise<GetApprovedTrainersResponse>;
  getOneTrainerDetails(trainerId: string): Promise<ITrainerModel>;
  getSubscribedTrainersDetails(
    userId: string
  ): Promise<SubscribedTrainerWithExpiry[]>;
  getMyTrainees(
    page: number,
    limit: number,
    search: string,
    trainerUserId: string
  ): Promise<PaginatedTraineesResult>;
  getTraineeDetails(
    traineeId: string,
    trainerUserId: string
  ): Promise<TraineeData>;
}
