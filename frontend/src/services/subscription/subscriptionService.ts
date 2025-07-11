import api from "../../config/axios.config";
import { SubscriptionsResponse } from "../../types/trainee.type";

export const getUserSubscriptionhistory = async (data: {
  page: number;
  limit: number;
}): Promise<SubscriptionsResponse> => {
  const response = await api.get(`/subscription/history`, {
    params: data,
  });
  return response.data.data;
};
