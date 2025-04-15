import { inject, injectable } from "tsyringe";
import UserModel, { IUserModel } from "../../models/user.models";
import { BaseRepository } from "./base.repository";
import { IAuthRepository } from "../Interface/IAuthRepository";
import { RedisClientType } from "redis";
import { IGoogleUser } from "../../types/auth.types";

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
    const user = await this.findOne({ username });
    return !!user;
  }

  async isEmailTaken(email: string): Promise<boolean> {
    const user = await this.findOne({ email });
    return !!user;
  }

  async storeOtp(email: string, otp: string): Promise<void> {
    await this.redisClient.set(`otp:${email}`, otp, { EX: 300 });
  }

  async getOtp(email: string): Promise<string | null> {
    return await this.redisClient.get(`otp:${email}`);
  }

  async deleteOtp(email: string): Promise<void> {
    await this.redisClient.del(`otp:${email}`);
  }

  async updatepassword(email: string, password: string): Promise<void> {
    await UserModel.updateOne({ email: email }, { password: password });
  }

  async createUser(data: Partial<IUserModel>): Promise<IUserModel> {
    return await UserModel.create(data);
  }

  async findByEmail(email: string): Promise<IUserModel | null> {
    return UserModel.findOne({ email });
  }

  async findOrCreateGoogleUser(googleUser: IGoogleUser): Promise<IUserModel> {
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
  }
}
