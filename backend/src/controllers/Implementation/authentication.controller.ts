import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import { IAuthenticationController } from '../Interface/IAuthenticationController';
import { IAuthenticationService } from '../../services/Interface/IAuthenticationService';
import {
    HTTPStatusCodes,
    ResponseMessage,
    SendResponse
} from 'mern.common';


@injectable()
export default class AuthenticationController implements IAuthenticationController {
    private authenticationService: IAuthenticationService;
    
    constructor(
        @inject("AuthenticationService") authenticationService: IAuthenticationService,
    ) {
        this.authenticationService = authenticationService;
    }

    async checkUsernameEmail(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { email, username }: { email: string, username: string } = req.body
            const result = await this.authenticationService.nameEmailCheck(email, username);
            await this.authenticationService.sendOtp(email); // Send OTP if email is available
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS,result)
        } catch (error: any) {
            next(error);
        }
    }

    async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, otp } = req.body;
            const isValid = await this.authenticationService.verifyOtp(email, otp);
            if (!isValid) {
                res.status(400).json({ message: "Invalid or expired OTP" });
                return;
            }
            res.status(200).json({ message: "OTP verified successfully" });
        } catch (error) {
            next(error);
        }
    }
}

