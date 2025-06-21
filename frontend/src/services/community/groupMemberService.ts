import api from "../../config/axios.config";

export interface GroupMember {
  _id: string;
  userId: {
    _id: string;
    username: string;
    email: string;
    profilePicture?: string;
    role?: "user" | "trainer" | "admin";
  };
  status: "active" | "left" | "kicked" | "blocked";
  joinedAt: string;
  blockedAt?: string;
  kickedAt?: string;
  leaveAt?: string;
}

export interface GetGroupMembersQueryParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}

export interface GetGroupMembersResponse {
  members: GroupMember[];
  totalMembers: number;
  currentPage: number;
  totalPages: number;
}

interface UpdateMemberStatusPayload {
  status: "active" | "left" | "kicked" | "blocked";
}

interface UpdateMemberStatusResponse {
  message: string;
  member: GroupMember;
}

export const getGroupMembers = async (
  groupId: string,
  params: GetGroupMembersQueryParams
): Promise<GetGroupMembersResponse> => {
  const response = await api.get<GetGroupMembersResponse>(
    `/groups/${groupId}/members`,
    {
      params: {
        page: params.page,
        limit: params.limit,
        ...(params.search && { search: params.search }),
        ...(params.status &&
          params.status !== "all" && { status: params.status }),
      },
    }
  );
  return response.data;
};


export const updateGroupMemberStatus = async (
  groupId: string,
  memberId: string,
  payload: UpdateMemberStatusPayload
): Promise<UpdateMemberStatusResponse> => {
    const response = await api.patch<UpdateMemberStatusResponse>(
      `/groups/${groupId}/members/${memberId}/status`,
      payload 
    );
    return response.data;
};
