export interface UserProfile {
  username: string;
  profilePicture?: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pinCode: string;
  joinedDate: string;
}

export interface UpdateProfileData {
  gender: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pinCode: string;
}

export interface UserResponse {
  _id: string;
  username: string;
  profilePicture?: string;
  email: string;
  isBlocked: boolean;
  createdAt: string;
}

export interface UsersResponse {
  users: UserResponse[];
  total: number;
}

export interface SubscriptionHistoryItem {
  _id: string;
  startDate: string;
  expiryDate?: string;
  status: string;
  amount: number;
  planDuration: string;
}

export interface TraineeResponse {
  _id: string;
  username: string;
  profilePicture?: string;
  email: string;
  isBlocked: boolean;
  createdAt: string;
  subscriptionHistory: SubscriptionHistoryItem[];
}

export interface PaginatedTraineesResult {
  trainees: TraineeResponse[];
  total: number;
}
