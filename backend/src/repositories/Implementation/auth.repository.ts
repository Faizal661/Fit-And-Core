import { inject, injectable } from "tsyringe";
import UserModel, { IUserModel } from "../../models/user.models";
import { BaseRepository } from "./base.repository";
import { IAuthRepository } from "../Interface/IAuthRepository";
import { RedisClientType } from "redis";
import { IGoogleUser } from "../../types/auth.types";
import CustomError from "../../errors/CustomError";
import { HttpResCode } from "../../constants/http-response.constants";

@injectable()
export class AuthRepository
  extends BaseRepository<IUserModel>
  implements IAuthRepository
{
  private redisClient: RedisClientType;

  constructor(@inject("RedisClient") redisClient: RedisClientType) {
    super(UserModel);
    this.redisClient = redisClient;
  }

  async isUsernameTaken(username: string): Promise<boolean> {
    try {
      const user = await this.findOne({ username });
      return !!user;
    } catch (error) {
      throw new CustomError(
        "failed to check valid username",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async isEmailTaken(email: string): Promise<boolean> {
    try {
      const user = await this.findOne({ email });
      return !!user;
    } catch (error) {
      throw new CustomError(
        "failed to check valid email",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async storeOtp(email: string, otp: string): Promise<void> {
    try {
      await this.redisClient.set(`otp:${email}`, otp, { EX: 300 });
    } catch (error) {
      throw new CustomError(
        "failed to store otp",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getOtp(email: string): Promise<string | null> {
    try {
      return await this.redisClient.get(`otp:${email}`);
    } catch (error) {
      throw new CustomError(
        "failed to get otp",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteOtp(email: string): Promise<void> {
    try {
      await this.redisClient.del(`otp:${email}`);
    } catch (error) {
      throw new CustomError(
        "failed to delete otp",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updatepassword(email: string, password: string): Promise<void> {
    try {
      await UserModel.updateOne({ email: email }, { password: password });
    } catch (error) {
      throw new CustomError(
        "failed to update password",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createUser(data: Partial<IUserModel>): Promise<IUserModel> {
    try {
      return await UserModel.create(data);
    } catch (error) {
      throw new CustomError(
        "failed to create user",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findByEmail(email: string): Promise<IUserModel | null> {
    try {
      return UserModel.findOne({ email });
    } catch (error) {
      throw new CustomError(
        "failed to find user",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findOrCreateGoogleUser(googleUser: IGoogleUser): Promise<IUserModel> {
    try {
      const existingUser = await UserModel.findOne({ email: googleUser.email });

      if (existingUser) {
        if (!existingUser.googleId && googleUser.id) {
          existingUser.googleId = googleUser.id;
          existingUser.profilePicture =
            googleUser.profilePicture || existingUser.profilePicture;
          await existingUser.save();
        }
        return existingUser;
      }

      const newUser = new UserModel({
        email: googleUser.email,
        username: googleUser.displayName,
        googleId: googleUser.id,
        profilePicture: googleUser.profilePicture,
      });

      return await newUser.save();
    } catch (error) {
      throw new CustomError(
        "failed to find or create google user",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
