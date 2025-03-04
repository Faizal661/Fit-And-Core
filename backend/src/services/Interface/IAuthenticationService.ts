export interface IAuthenticationService {
    nameEmailCheck(email: string, username: string): Promise<any>;
    // otpCheck(otp:string):Promise<any>;
}