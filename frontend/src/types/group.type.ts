
export interface GroupMember {
  _id: string;
  username: string;
  profilePicture?: string;
}

export interface GroupDetails {
  _id: string;
  name: string;
  description?: string;
  avatar?: string;
  members: GroupMember[];
}