import api from "../../config/axios.config";

import { ProgressionFormData } from "../../schemas/progressSchema";

export const getProgressionData = async (traineeId:string) => {
  const response = await api.get(`/progress/${traineeId}`);
  return response.data.progressions;
};

export const newProgression = async (data: ProgressionFormData) => {
  const response = await api.post(`/progress/new-progress`, data);
  return response.data;
};
