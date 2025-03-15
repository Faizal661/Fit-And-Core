import IBaseRepository from './IBaseRepository.ts'
import { IUser } from '../../types/user.types.ts'; 
import { IUserModel } from '../../models/user.models.ts';

export interface IAuthRepository {
    isUsernameTaken(username: string): Promise<boolean | null>;
    isEmailTaken(email: string): Promise<boolean | null>;
    storeOtp(email: string, otp: string): Promise<void>
    getOtp(email: string): Promise<string | null>
    deleteOtp(email: string): Promise<void>
    createUser(data: Partial<IUserModel>): Promise<IUserModel>
    findByEmail(email: string): Promise<IUserModel | null> 
}