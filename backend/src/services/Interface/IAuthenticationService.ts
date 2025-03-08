export interface IAuthenticationService {
    nameEmailCheck(email: string, username: string): Promise<{ available: boolean,username:string,email:string }>
    sendOtp(email: string): Promise<void>;
    verifyOtp(email: string, otp: string): Promise<boolean>;
}