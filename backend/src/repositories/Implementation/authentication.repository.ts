import { inject,injectable } from "tsyringe";
import UserModel,{ IUserModel } from "../../models/user.models"; 
import { BaseRepository } from "./base.repository";
import { IAuthenticationRepository } from "../Interface/IAuthenticationRepository";
import { RedisClientType } from 'redis';

@injectable()
export class AuthenticationRepository extends BaseRepository<IUserModel> implements IAuthenticationRepository {
    private redisClient: RedisClientType;

    constructor(@inject('RedisClient') redisClient: RedisClientType) {
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
        await this.redisClient.set(`otp:${email}`, otp,{ EX:300 });
    }

    async getOtp(email: string): Promise<string | null> {
        return await this.redisClient.get(`otp:${email}`);
    }

    async deleteOtp(email: string): Promise<void> {
        await this.redisClient.del(`otp:${email}`);
    }
}