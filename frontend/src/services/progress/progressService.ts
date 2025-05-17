import api from "../../config/axios.config";
import { ProgressionFormData } from "../../schemas/progressSchema";

export const getMyProgressionData = async () => {
  const response = await api.get(`/progress/my-progressions`);
  response.data.progressions.map((p)=>console.log(p.createdAt))
  return response.data.progressions;
};

export const newProgression = async (data: ProgressionFormData) => {
  const response = await api.post(`/progress/new-progress`, data);
  return response.data;
};
