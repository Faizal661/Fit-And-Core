import api from "../../config/axios.config";
import { ApplicationStatus, SubscribedTrainerWithExpiry } from "../../types/trainer.type";

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
  page = 1,
  limit = 10,
  searchTerm,
}: {
  specialization?: string;
  page?: number;
  limit?: number;
  searchTerm?: string;
}) => {
  const response = await api.get("/trainer/approved", {
    params: { specialization, page, limit, searchTerm },
  });
  return response.data.approvedTrainers;
};

export const getSubscribedTrainers = async (
  userId: string | undefined
): Promise<SubscribedTrainerWithExpiry[]> => {
  const response = await api.get(`/trainer/subscriptions/${userId}`);
  return response.data.subscribedTrainers;
};

export const getTrainerData = async (trainerId: string | undefined) => {
  const response = await api.get(`/trainer/${trainerId}`);
  return response.data.trainerData;
};

