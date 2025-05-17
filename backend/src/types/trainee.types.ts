export interface TraineeData {
  traineeId: string;
  username: string;
  profilePicture: string;
  email: string;
  isBlocked: boolean;
  createdAt: Date;
  subscriptionHistory: Array<{
    _id: string;
    startDate: Date| null;
    expiryDate: Date | null;
    amount: number;
    planDuration: string;
    status:string;
  }>;
}

export interface PaginatedTraineesResult {
  trainees: TraineeData[];
  total: number;
}
