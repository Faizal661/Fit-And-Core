import api from "../../config/axios.config";

export const uploadVideo = async (formData: FormData) => {
  const response = await api.post(`/recording/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
