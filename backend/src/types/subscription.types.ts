import { Types } from "mongoose";

export interface ISubscription {
    _id: Types.ObjectId;
    userId:  Types.ObjectId ;
    trainerId:  Types.ObjectId ;
    planDuration: string ;
    amount: number;
    sessions: number;
    status: 'pending' | 'active' | 'refunded' | 'expired';
    startDate: Date | null; 
    expiryDate: Date | null;
    // paymentId:  Types.ObjectId | null ;
    paymentId:  string | null ;
    createdAt?: Date;
    updatedAt?: Date;
  }

  export interface CheckoutSubscriptionParams {
    userId:string,
    trainerId: string;
    planDuration: string;
    amountInPaise: number;
    sessions?: number;
    planName: string;
  }

  export interface SubscriptionStatus {
    isSubscribed: boolean;
    subscription: {
      _id: string;
      planDuration: String;
      status: string;
      startDate: Date| null;
      expiryDate: Date| null;
    } | null;
  }


  export interface VerifiedPaymentResult {
    _id: Types.ObjectId;
    planDuration: string;
    amount: number;
    status: 'pending' | 'active' | 'refunded' | 'expired';
    startDate: Date | null;
    expiryDate: Date | null;
    trainerName?: string;
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
