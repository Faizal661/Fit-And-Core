import { inject, injectable } from "tsyringe";
import { Types } from "mongoose";
import { IUserService } from "../Interface/IUserService";
import { IUserRepository } from "../../repositories/Interface/IUserRepository";
import {
  IUser,
  IUserProfile,
  UserProfileUpdateData,
} from "../../types/user.types";
import {
  deleteFromCloudinary,
  extractPublicIdFromUrl,
  uploadToCloudinary,
} from "../../utils/s3-upload";
import { HttpResCode } from "../../constants/response.constants";
import { CustomError } from "../../errors/CustomError";
import { IAuthRepository } from "../../repositories/Interface/IAuthRepository";
import bcrypt from "bcryptjs";
import { IUserModel } from "../../models/user.models";
import logger from "../../utils/logger.utils";

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

@injectable()
export default class UserService implements IUserService {
  private userRepository: IUserRepository;
  private authRepository: IAuthRepository;

  constructor(
    @inject("UserRepository")
    userRepository: IUserRepository,
    @inject("AuthRepository")
    authRepository: IAuthRepository
  ) {
    this.userRepository = userRepository;
    this.authRepository = authRepository;
  }

  async getUsers(
    page: number,
    limit: number,
    search: string
  ): Promise<UsersResponse> {
    const skip = (page - 1) * limit;
    let filter: any = { role: { $ne: "admin" } }; 

    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      this.userRepository.find(filter).skip(skip).limit(limit).exec(),
      this.userRepository.countDocuments(filter),
    ]);

    const formattedUsers = users.map((user: IUserModel) => ({
      _id: (user._id as Types.ObjectId).toString(),
      username: user.username,
      profilePicture: user.profilePicture || "",
      email: user.email,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt,
    }));

    return { users: formattedUsers, total };
  }

  async toggleBlockStatus(userId: string, isBlocked: boolean): Promise<any> {
    const user = await this.userRepository.findById(new Types.ObjectId(userId));

    if (!user) {
      throw new CustomError("User not found", HttpResCode.NOT_FOUND);
    }

    if (user.role === "admin") {
      throw new CustomError(
        "Cannot block an admin user",
        HttpResCode.FORBIDDEN
      );
    }

    const updatedUser = await this.userRepository.update(
      new Types.ObjectId(userId),
      { isBlocked: !isBlocked }
    );

    if (!updatedUser) {
      throw new CustomError(
        "Failed to update user status",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }

    return {
      _id: (updatedUser._id as Types.ObjectId).toString(),
      username: updatedUser.username,
      profilePicture: updatedUser.profilePicture || "",
      email: updatedUser.email,
      isBlocked: updatedUser.isBlocked,
      createdAt: updatedUser.createdAt,
    };
  }

  async getUserProfile(userId: string | Types.ObjectId): Promise<IUserProfile> {
    const user = await this.userRepository.findById(
      typeof userId === "string" ? new Types.ObjectId(userId) : userId
    );

    if (!user) {
      throw new CustomError("User not found", HttpResCode.NOT_FOUND);
    }

    return {
      username: user.username,
      profilePicture: user.profilePicture,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      phone: user.phone,
      email: user.email,
      address: user.address,
      city: user.city,
      pinCode: user.pinCode,
      joinedDate: user.createdAt,
    };
  }

  async updateUserProfile(
    userId: string | Types.ObjectId,
    updateData: UserProfileUpdateData
  ): Promise<IUserProfile> {
    const objectId =
      typeof userId === "string" ? new Types.ObjectId(userId) : userId;

    if (updateData.username || updateData.password) {
      throw new CustomError(
        "Username and password cannot be updated through this endpoint",
        HttpResCode.BAD_REQUEST
      );
    }

    const updatedUser = await this.userRepository.update(objectId, updateData);

    if (!updatedUser) {
      throw new CustomError(
        "User not found or update failed",
        HttpResCode.NOT_FOUND
      );
    }

    return {
      username: updatedUser.username,
      profilePicture: updatedUser.profilePicture,
      gender: updatedUser.gender,
      dateOfBirth: updatedUser.dateOfBirth,
      phone: updatedUser.phone,
      email: updatedUser.email,
      address: updatedUser.address,
      city: updatedUser.city,
      pinCode: updatedUser.pinCode,
      joinedDate: updatedUser.createdAt,
    };
  }

  async updateProfilePicture(
    userId: string | Types.ObjectId,
    file: Express.Multer.File
  ): Promise<IUserProfile> {
    const objectId =
    typeof userId === "string" ? new Types.ObjectId(userId) : userId;

    const currentUser = await this.userRepository.findById(objectId);
    if (!currentUser) {
      throw new CustomError("User not found", HttpResCode.NOT_FOUND);
    }

    let oldPublicId = null;
    if (currentUser.profilePicture) {
      oldPublicId = extractPublicIdFromUrl(currentUser.profilePicture);
    }

    const cloudinaryResult = await uploadToCloudinary(file, "profile-pictures");

    const updateData = { profilePicture: cloudinaryResult.Location };
    const updatedUser = await this.userRepository.update(objectId, updateData);

    if (!updatedUser) {
      throw new CustomError(
        "User not found or update failed",
        HttpResCode.NOT_FOUND
      );
    }

    if (oldPublicId) {
      try {
        await deleteFromCloudinary(oldPublicId);
      } catch (error) {
        logger.error("Failed to delete old profile picture:", error);
      }
    }

    return {
      username: updatedUser.username,
      profilePicture: updatedUser.profilePicture,
      gender: updatedUser.gender,
      dateOfBirth: updatedUser.dateOfBirth,
      phone: updatedUser.phone,
      email: updatedUser.email,
      address: updatedUser.address,
      city: updatedUser.city,
      pinCode: updatedUser.pinCode,
      joinedDate: updatedUser.createdAt,
    };
  }

  async updatePassword(
    email: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ isUpdated: boolean }> {
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new CustomError(
        "User not found or update failed",
        HttpResCode.NOT_FOUND
      );
    }
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password!
    );
    if (!isPasswordValid) {
      throw new CustomError(
        "Current Password is invalid",
        HttpResCode.BAD_REQUEST
      );
    }
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await this.authRepository.updatepassword(email, newHashedPassword);
    return { isUpdated: true };
  }
}
