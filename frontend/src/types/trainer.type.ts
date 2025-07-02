import { approvedTrainersWithRatings } from "./review.types";

export interface Trainer {
  _id: string;
  userId: string;
  username: string;
  email: string;
  phone: string;
  profilePicture:string;
  specialization: string;
  yearsOfExperience: string;
  about: string;
  documentProofs: string[];
  certifications: string[];
  achievements: string[];
  // isApproved: boolean;
  status: "pending" | "approved" | "rejected";
  reason?:string;
  createdAt: string;
  updatedAt: string;
}


export interface ApplicationStatus {
  status: "none" | "pending" | "approved" | "rejected";
  reason?: string;
}

export interface SubscribedTrainerWithExpiry extends Trainer {
  subscriptionExpiryDate: Date; 
}

export interface GetApprovedTrainersResponse {
  trainers: approvedTrainersWithRatings[]; 
  totalCount: number; 
}