import IBaseRepository from '../Interface/IBaseRepository.ts'
import { IUser } from '../../types/user.types.ts'; 

export interface IAuthenticationRepository {
    isUsernameTaken(username: string): Promise<boolean | null>;
    isEmailTaken(email: string): Promise<boolean | null>;
    storeOtp(email: string, otp: string): Promise<void>
    getOtp(email: string): Promise<string | null>
    deleteOtp(email: string): Promise<void>

}