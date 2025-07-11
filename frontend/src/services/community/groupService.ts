import api from "../../config/axios.config";
import {
  GetAvailableGroupsResponse,
  GroupQueryParams,
  GroupResponse,
  JoinGroupResponse,
} from "../../types/community.type";
import { GroupDetails } from "../../types/group.type";

// admin
export const getGroups = async (
  params: GroupQueryParams
): Promise<GroupResponse> => {
  const response = await api.get("/groups", {
    params: {
      page: params.page,
      limit: params.limit,
      ...(params.search && { search: params.search }),
    },
  });
  return response.data.groupResponse;
};

export const createGroup = async (groupData: FormData) => {
  const response = await api.post("/groups", groupData);
  return response.data;
};

// user and trainer

export const getAvailableGroups = async (
  params: GroupQueryParams
): Promise<GetAvailableGroupsResponse> => {
  const response = await api.get("/groups/available", {
    params: {
      page: params.page,
      limit: params.limit,
      ...(params.search && { search: params.search }),
    },
  });
  return response.data.availableGroupsData;
};

export const joinGroup = async (
  groupId: string
): Promise<JoinGroupResponse> => {
  const response = await api.post<JoinGroupResponse>(`/groups/${groupId}/join`);
  return response.data;
};


export const getGroupDetails = async (
  groupId: string
): Promise<GroupDetails> => {
  const response = await api.get<GroupDetails>(`/groups/${groupId}/details`);
  return response.data;
};
