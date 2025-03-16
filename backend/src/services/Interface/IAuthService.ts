import { IUserModel } from "../../models/user.models";
import { IGoogleUser, ILoginResponse } from "../../types/auth.types";

export interface IAuthService {
    nameEmailCheck(email: string, username: string): Promise<{ available: boolean,username?:string,email?:string,message:string }>
    sendOtp(email: string): Promise<void>;
    verifyOtp(email: string, otp: string): Promise<{success:boolean,message:string}>;
    registerUser(username: string, email: string, password: string): Promise<IUserModel>
    login(email: string, password: string): Promise<ILoginResponse> 
    googleLogin(googleUser: IGoogleUser): Promise<ILoginResponse>
    refreshTokens(email:string): Promise<{newAccessToken:string, newRefreshToken:string }> 
    verifyGoogleToken(token:string): Promise<ILoginResponse>
}