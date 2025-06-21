import { GroupMember } from "../services/community/groupMemberService";

export interface Group {
  _id: string;
  name: string;
  description: string;
  adminId: string;
  groupImage?: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GroupQueryParams {
  page: number;
  limit: number;
  search?: string; 
}

export interface GroupResponse {
  groups: Group[];
  totalGroups: number;
  currentPage: number;
  totalPages: number;
}

//----

export interface AvailableGroup extends Group { 
  isJoined: boolean; 
}

export interface GetAvailableGroupsResponse {
  groups: AvailableGroup[];
  totalGroups: number;
  currentPage: number;
  totalPages: number;
}


export interface JoinGroupResponse {
  message: string;
  member: GroupMember; 
}