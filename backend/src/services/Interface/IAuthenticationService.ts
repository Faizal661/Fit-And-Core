export interface IAuthenticationService {
    nameEmailCheck(email: string, username: string): Promise<{ available: boolean,username:string,email:string }>
    // otpCheck(otp:string):Promise<any>;
}