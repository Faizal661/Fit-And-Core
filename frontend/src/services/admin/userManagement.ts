import axios from "../../config/axios.config";


export interface User {
  _id: string;
  username: string;
  profilePicture?: string;
  email: string;
  isBlocked: boolean;
  createdAt: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
}

export const fetchUsers = async ({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search: string;
}): Promise<UsersResponse> => {
  const response = await axios.get<UsersResponse>("/user/users", {
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
}): Promise<User> => {
  const response = await axios.patch<User>(`/user/${userId}/block`, {
    isBlocked: isBlocked,
  });
  return response.data;
};
