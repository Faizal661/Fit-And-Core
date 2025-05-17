import api from "../../config/axios.config";
import { UserResponse, UsersResponse } from "../../types/user.type";

export const fetchUsers = async ({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search: string;
}): Promise<UsersResponse> => {
  const response = await api.get<UsersResponse>("/user/users", {
    params: { page, limit, search },
  });
  return response.data;
};

export const toggleBlockStatus = async ({
  userId,
  isBlocked,
}: {
  userId: string;
  isBlocked: boolean;
}): Promise<UserResponse> => {
  const response = await api.patch<UserResponse>(`/user/${userId}/block`, {
    isBlocked: isBlocked,
  });
  return response.data;
};
