import { Types } from "mongoose";

export interface ISubscripton {
    _id: Types.ObjectId;
    userId:  Types.ObjectId ;
    trianerId:  Types.ObjectId ;
    planDuration: String ;
    amount: Number;
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
    planName: string;
  }