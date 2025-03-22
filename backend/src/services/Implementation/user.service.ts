import { inject, injectable } from "tsyringe";
import { Types } from "mongoose";
import { IUserService } from "../Interface/IUserService";
import { IUserRepository } from "../../repositories/Interface/IUserRepository";
import { IUserProfile, UserProfileUpdateData } from "../../types/user.types";
import { deleteFromS3, uploadToS3 } from "../../utils/s3-upload";
import { HttpResCode } from "../../constants/Response.constants";
import { CustomError } from "../../errors/CustomError";

@injectable()
export default class UserService implements IUserService {
  private userRepository: IUserRepository;

  constructor(
    @inject("UserRepository")
    userRepository: IUserRepository
  ) {
    this.userRepository = userRepository;
  }

  async getUserProfile(userId: string | Types.ObjectId): Promise<IUserProfile> {
    const user = await this.userRepository.findById(
      typeof userId === "string" ? new Types.ObjectId(userId) : userId
    );

    if (!user) {
      throw new CustomError('User not found', HttpResCode.NOT_FOUND);    }

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
      throw new CustomError('Username and password cannot be updated through this endpoint', HttpResCode.BAD_REQUEST);
    }

    const updatedUser = await this.userRepository.update(objectId, updateData);

    if (!updatedUser) {
      throw new CustomError('User not found or update failed', HttpResCode.NOT_FOUND);    }

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
      throw new CustomError('User not found', HttpResCode.NOT_FOUND);    }

    let oldProfilePictureKey = null;
    if (currentUser.profilePicture) {
      const urlParts = currentUser.profilePicture.split(".s3.amazonaws.com/");
      if (urlParts.length > 1) {
        oldProfilePictureKey = urlParts[1];
      }
    }

    const s3Result = await uploadToS3(file, "profile-pictures");

    const updateData = { profilePicture: s3Result.Location };
    const updatedUser = await this.userRepository.update(objectId, updateData);

    if (!updatedUser) {
      throw new CustomError('User not found or update failed', HttpResCode.NOT_FOUND);    }

    if (oldProfilePictureKey) {
      try {
        await deleteFromS3(oldProfilePictureKey);
      } catch (error) {
        console.error("Failed to delete old profile picture:", error);
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
}
