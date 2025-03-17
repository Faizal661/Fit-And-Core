import { inject, injectable } from "tsyringe";
import { Types } from "mongoose";
import { IUserService } from "../Interface/IUserService";
import { IUserRepository } from "../../repositories/Interface/IUserRepository";
import { IUserProfile, UserProfileUpdateData } from "../../types/user.types";

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
      throw new Error("User not found");
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
      throw new Error(
        "Username and password cannot be updated through this endpoint"
      );
    }

    const updatedUser = await this.userRepository.update(objectId, updateData);

    if (!updatedUser) {
      throw new Error("User not found or update failed");
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
