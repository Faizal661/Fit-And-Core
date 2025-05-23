import api from "../../config/axios.config";
import { PaginatedTraineesResult } from "../../types/trainee.type"; //  users: UserResponse[]; total: number;

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
    "/trainer/trainees",
    {
      params: { page, limit, search },
    }
  );
  return response.data;
};

export const getTraineeData = async (traineeId: string)=> {
  const response = await api.get(
    `/trainer/trainees/${traineeId}`
  );
  return response.data.result;
};
