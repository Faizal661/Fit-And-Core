import axios from "../../config/axios.config";
import { ApplicationStatus } from "../../types/trainer.type";

export const checkTrainerApplicationStatus =
  async (): Promise<ApplicationStatus> => {
    const response = await axios.get("/trainer/application/status");
    return response.data;
  };

export const getApprovedTrainers = async ({
  specialization,
}: {
  specialization?: string;
}) => {
  const response = await axios.get("/trainer/trainer-approved", {
    params: { specialization },
  });
  return response.data.approvedTrainers;
};

export const getTrainerData = async (trainerId: string | undefined) => {
  const response = await axios.get(`/trainer/${trainerId}`);
  return response.data.trainerData;
};

export const getSubscribedTrainers = async (userId: string | undefined) => {
  const response = await axios.get(`/trainer/subscribed/${userId}`);
  return response.data;
};
