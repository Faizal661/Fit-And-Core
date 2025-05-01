import api from "../../config/axios.config";
import { ApplicationStatus, Trainer } from "../../types/trainer.type";

export const checkTrainerApplicationStatus =
  async (): Promise<ApplicationStatus> => {
    const response = await api.get("/trainer/application/status");
    return response.data;
  };

export const getApprovedTrainers = async ({
  specialization,
}: {
  specialization?: string;
}) => {
  const response = await api.get("/trainer/trainer-approved", {
    params: { specialization },
  });
  return response.data.approvedTrainers;
};

export const getTrainerData = async (trainerId: string | undefined) => {
  const response = await api.get(`/trainer/${trainerId}`);
  return response.data.trainerData;
};



export const getSubscribedTrainers = async (userId: string | undefined): Promise<Trainer[]> => {
  const response = await api.get(`/trainer/subscribed/${userId}`);
  return response.data.subscribedTrainers;
};
