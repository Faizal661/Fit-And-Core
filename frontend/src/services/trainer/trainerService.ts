import api from "../../config/axios.config";
import { ApplicationStatus, Trainer } from "../../types/trainer.type";

export const submitTrainerApplication = async (data: FormData) => {
  const response = await api.post("/trainer/applications", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const checkTrainerApplicationStatus =
  async (): Promise<ApplicationStatus> => {
    const response = await api.get("/trainer/applications/status");
    return response.data;
  };

export const getApprovedTrainers = async ({
  specialization,
}: {
  specialization?: string;
}) => {
  const response = await api.get("/trainer/approved", {
    params: { specialization },
  });
  return response.data.approvedTrainers;
};

export const getSubscribedTrainers = async (
  userId: string | undefined
): Promise<Trainer[]> => {
  const response = await api.get(`/trainer/subscriptions/${userId}`);
  return response.data.subscribedTrainers;
};

export const getTrainerData = async (trainerId: string | undefined) => {
  const response = await api.get(`/trainer/${trainerId}`);
  return response.data.trainerData;
};

