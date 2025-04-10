export interface Trainer {
  _id: string;
  userId: string;
  username: string;
  email: string;
  phone: string;
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
