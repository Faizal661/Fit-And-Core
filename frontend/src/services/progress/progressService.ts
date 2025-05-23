import api from "../../config/axios.config";

import { ProgressionFormData } from "../../schemas/progressSchema";

export const getProgressionData = async (traineeId:string) => {
  const response = await api.get(`/progress/${traineeId}`);
  return response.data.progressions;
};

export const newProgression = async ({data,userId}:{data: ProgressionFormData,userId:string}) => {
  const response = await api.post(`/progress/${userId}`, data);
  return response.data;
};
