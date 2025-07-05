import { Types } from "mongoose";

export interface GroupMember {
  _id: string;
  username: string;
  profilePicture?: string;
}

export type GroupMemberPopulated = {
  _id: Types.ObjectId;
  userId: {
    _id: Types.ObjectId;
    username: string;
    profilePicture?: string;
  };
};

export interface GroupDetails {
  _id: string;
  name: string;
  description?: string;
  avatar?: string;
  members: GroupMember[];
}
