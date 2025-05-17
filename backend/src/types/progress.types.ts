import { Types } from "mongoose";

export interface IProgress{
    _id?: Types.ObjectId;
    userId: Types.ObjectId;
    height:number;
    weight:number;
    bmi:number;
    bmiClass: "underweight" | "normal" | "overweight" | "obese";
    createdAt: Date;
    updatedAt: Date;
}