import { Types } from "mongoose";
import { IUserProfile, UserProfileUpdateData } from "../../types/user.types";
interface UsersResponse {
  users: {
    _id: string;
    username: string;
    profilePicture: string;
    email: string;
    isBlocked: boolean;
    createdAt: Date;
  }[];
  total: number;
}
export interface IUserService {
  getUsers(page: number, limit: number, search: string): Promise<UsersResponse>
  toggleBlockStatus(userId: string, isBlocked: boolean): Promise<any>
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
  updatePassword(email:string,currentPassword:string, newPassword:string): Promise<{isUpdated:boolean}>;
}