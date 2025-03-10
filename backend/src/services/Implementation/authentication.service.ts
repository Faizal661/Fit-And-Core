import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { HTTPStatusCodes,ConflictError } from "mern.common";
import { IAuthenticationService } from '../Interface/IAuthenticationService';
import { IAuthenticationRepository } from '../../repositories/Interface/IAuthenticationRepository';
import { sendEmail } from '../../utils/email.service';
import { randomInt } from 'crypto';

@injectable()
export default class AuthenticationService implements IAuthenticationService {

    private authenticationRepository: IAuthenticationRepository;

    constructor(
        @inject('AuthenticationRepository') authenticationRepository: IAuthenticationRepository
    ) {
        this.authenticationRepository = authenticationRepository
    }

    async nameEmailCheck(email: string, username: string): Promise<{ available: boolean,username:string,email:string }> {
        const isUsernameTaken = await this.authenticationRepository.isUsernameTaken(username);
        const isEmailTaken = await this.authenticationRepository.isEmailTaken(email);

        if (isUsernameTaken) {
            throw new ConflictError("Username already taken");
        }else if ( isEmailTaken){
            throw new ConflictError("Email already taken");
        }

        return { available: true , username :username , email:email };
    }

    async sendOtp(email: string): Promise<void> {
        const otp = randomInt(100000, 999999).toString();
        console.log('otp->',otp)
        await this.authenticationRepository.storeOtp(email, otp); 
        await sendEmail(email, otp);
    }

    async verifyOtp(email: string, otp: string): Promise<{success:boolean,message:string}> {
        const storedOtp = await this.authenticationRepository.getOtp(email);
        // console.log('redisOtp=>',storedOtp)
        if (!storedOtp || storedOtp !== otp) {
            return {success:false,message: "Invalid or expired OTP"}
        }
        await this.authenticationRepository.deleteOtp(email);
        // console.log('otp deleted from redis')
        return { success: true, message: "OTP verified successfully" };
    }
}