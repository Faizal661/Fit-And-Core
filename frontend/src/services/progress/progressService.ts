import api from "../../config/axios.config";
import { ProgressionFormData } from "../../schemas/progressSchema";

export const getMyProgressionData = async () => {
  const response = await api.get(`/progress/my-progressions`);
  return response.data.progressions;
  console.log("🚀 ~ getMyProgressionData ~ response:", response)
};

export const newProgression = async (data: ProgressionFormData) => {
  const response = await api.post(`/progress/new-progress`, data);
  return response.data;
};
