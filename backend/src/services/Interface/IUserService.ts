import { Types } from "mongoose";
import { AllUsersData, IUserProfile, UserProfileUpdateData } from "../../types/user.types";
import { IUserModel } from "../../models/user.models";

export interface IUserService {
  getUsers(page: number, limit: number, search: string): Promise<AllUsersData>
  toggleBlockStatus(userId: string, isBlocked: boolean): Promise<IUserModel>
  updateUserProfile(
    userId: string | Types.ObjectId,
    updateData: UserProfileUpdateData
  ): Promise<IUserProfile>
  getUserProfile(userId: string | Types.ObjectId): Promise<IUserProfile>;
  updateUserProfile(
    userId: string | Types.ObjectId,
    updateData: UserProfileUpdateData
  ): Promise<IUserProfile>;
  updateProfilePicture(userId: string | Types.ObjectId, file: Express.Multer.File): Promise<IUserProfile>;
  updatePassword(email:string,currentPassword:string, newPassword:string): Promise<void>;
}