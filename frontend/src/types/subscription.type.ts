export interface SubscriptionData {
  trainerId: string;
  planDuration: string;
  amountInPaise: number;
  sessions:number;
  planName: string;
}

export interface subscriptionPlans {
  duration: string;
  amount: string;
  amountInPaise: number;
  sessions:number;
  savings: number;
}

export interface SubscriptionStatus {
  isSubscribed: boolean;
  subscription: {
    planDuration: string;
    status: string;
    startDate: string;
    expiryDate: string;
  } | null;
}
