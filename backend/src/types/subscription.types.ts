import { Types } from "mongoose";

export interface ISubscription {
    _id: Types.ObjectId;
    userId:  Types.ObjectId ;
    trainerId:  Types.ObjectId ;
    planDuration: String ;
    amount: Number;
    sessions: number;
    status: 'pending' | 'active' | 'cancelled' | 'expired';
    startDate: Date | null;
    expiryDate: Date | null;
    // paymentId:  Types.ObjectId | null ;
    paymentId:  String | null ;
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