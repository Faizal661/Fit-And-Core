import { Trainer } from "../../types/trainer";
import axios from "../../config/axios";


// Fetch all trainers
export const fetchTrainers = async (): Promise<Trainer[]> => {
  const response = await axios.get("/api/admin/trainers");

  return response.data.data.map((trainer: any) => {
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
  const response = await axios.put(`/api/admin/trainers/${trainerId}/approve`);
  return response.data.data;
};

export const rejectTrainer = async (trainerId: string): Promise<any> => {
  const response = await axios.put(`/api/admin/trainers/${trainerId}/reject`);
  return response.data.data;
};
