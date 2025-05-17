import api from "../../config/axios.config";
import { PaginatedTraineesResult } from "../../types/user.type"; //  users: UserResponse[]; total: number;

export const fetchTrainees = async ({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search: string;
}): Promise<PaginatedTraineesResult> => {
  const response = await api.get<PaginatedTraineesResult>(
    "/trainer/my-trainees",
    {
      params: { page, limit, search },
    }
  );
  return response.data;
};

export const getTraineeData = async (traineeId: string): Promise<any> => {
  const response = await api.get(
    `/trainer/trainee/${traineeId}`
  );
  return response.data.result;
};
