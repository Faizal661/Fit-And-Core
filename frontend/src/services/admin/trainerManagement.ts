import { Trainer } from "../../types/trainer.type";
import api from "../../config/axios.config";


export const fetchTrainers = async (): Promise<Trainer[]> => {
  const response = await api.get("/trainer/trainer-applications");
  return response.data.applications
};

export const approveTrainer = async (trainerId: string): Promise<Trainer> => {
  const response = await api.put(`/trainer/${trainerId}/approve`);
  return response.data.data;
};

export const rejectTrainer = async ({ trainerId, reason }: { trainerId: string; reason: string }): Promise<Trainer> => {
  const response = await api.put(`/trainer/${trainerId}/reject`, { reason });
  return response.data.data;
};

