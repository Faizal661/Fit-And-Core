import { Types } from "mongoose";

export interface ISubscripton {
    _id:  Types.ObjectId;
    userId:  Types.ObjectId ;
    trianerId:  Types.ObjectId ;
    plan: String ;
    amount: Number;
    endDate: Date ;
    startDate: Date;
    paymentId:  Types.ObjectId ;
    createdAt?: Date;
    updatedAt?: Date;
  }