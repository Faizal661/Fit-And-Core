

export interface TraineeData {
  traineeId: string;
  username: string;
  profilePicture: string;
  email: string;
  isBlocked: boolean;
  createdAt: string;
  subscriptionHistory: SubscriptionHistory[];
}

export interface PaginatedTraineesResult {
  trainees: TraineeData[];
  total: number;
}

export interface SubscriptionHistory {
  _id: string;
  startDate: string;
  expiryDate: string;
  planDuration: string;
  amount: number;
  status: string;
  trainerName?: string;
  trainerProfilePicture?: string;
}
export interface SubscriptionsResponse {
  subscriptions: SubscriptionHistory[];
  total: number;
  currentPage: number;
  totalPages: number;
}
