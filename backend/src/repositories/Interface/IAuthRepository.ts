import { IUserModel } from '../../models/user.models';
import { IGoogleUser } from '../../types/auth.types';

export interface IAuthRepository {
    isUsernameTaken(username: string): Promise<boolean | null>;
    isEmailTaken(email: string): Promise<boolean | null>;
    storeOtp(email: string, otp: string): Promise<void>
    getOtp(email: string): Promise<string | null>
    deleteOtp(email: string): Promise<void>
    createUser(data: Partial<IUserModel>): Promise<IUserModel>
    findByEmail(email: string): Promise<IUserModel | null> 
    findOrCreateGoogleUser(googleUser: IGoogleUser): Promise<IUserModel>;
    updatepassword(email: string,password:string): Promise<void>
}