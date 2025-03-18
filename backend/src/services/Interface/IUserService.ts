import { Types } from "mongoose";
import { IUserProfile, UserProfileUpdateData } from "../../types/user.types";

export interface IUserService {
  getUserProfile(userId: string | Types.ObjectId): Promise<IUserProfile>;
  updateUserProfile(
    userId: string | Types.ObjectId,
    updateData: UserProfileUpdateData
  ): Promise<IUserProfile>;
  updateProfilePicture(userId: string | Types.ObjectId, file: Express.Multer.File): Promise<IUserProfile>;
}