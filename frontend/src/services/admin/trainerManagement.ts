import { Trainer } from "../../types/trainer.type";
import axios from "../../config/axios.config";


// Fetch all trainers
export const fetchTrainers = async (): Promise<Trainer[]> => {
  const response = await axios.get("/trainer/trainer-applications");
  
  return response.data.applications.map((trainer: any) => {
    let status: "pending" | "approved" | "rejected";

    if (trainer.status) {
      status = trainer.status;
    } else {
      status = trainer.isApproved ? "approved" : "pending";
    }

    return {
      ...trainer,
      status,
    };
  });
};

export const approveTrainer = async (trainerId: string): Promise<any> => {
  const response = await axios.put(`/trainer/${trainerId}/approve`);
  return response.data.data;
};

export const rejectTrainer = async ({ trainerId, reason }: { trainerId: string; reason: string }): Promise<any> => {
  const response = await axios.put(`/trainer/${trainerId}/reject`, { reason });
  return response.data.data;
};

