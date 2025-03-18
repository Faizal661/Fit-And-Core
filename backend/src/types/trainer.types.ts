import { Request } from "express";

export interface UploadedFiles {
  documentProofs?: Express.Multer.File[];
  certifications?: Express.Multer.File[];
  achievements?: Express.Multer.File[];
  [fieldname: string]: Express.Multer.File[] | undefined;
}

export interface CustomRequest extends Omit<Request, "files"> {
  files?: UploadedFiles;
}

export interface TrainerApplicationData {
  userId: string;
  phone: string;
  specialization: string;
  yearsOfExperience: string;
  about: string;
  documentProofs: string[];
  certifications: string[];
  achievements: string[];
}
