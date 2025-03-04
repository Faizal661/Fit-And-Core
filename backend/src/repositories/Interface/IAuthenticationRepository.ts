import IBaseRepository from '../Interface/IBaseRepository.ts'
import { IUser } from '../../types/user.types.ts'; 

export interface IAuthenticationRepository {
    isUsernameTaken(email: string): Promise<boolean | null>;
    isEmailTaken(id: string): Promise<boolean | null>;
}