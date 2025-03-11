import { IUserModel } from "../../models/user.models";

export interface IAuthenticationService {
    nameEmailCheck(email: string, username: string): Promise<{ available: boolean,username?:string,email?:string,message:string }>
    sendOtp(email: string): Promise<void>;
    verifyOtp(email: string, otp: string): Promise<{success:boolean,message:string}>;
    registerUser(username: string, email: string, password: string): Promise<IUserModel>
}