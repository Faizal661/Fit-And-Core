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
            await this.authenticationService.sendOtp(email); 
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS,result)
        } catch (error: any) {
            next(error);
        }
    }
    
    async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, otp } = req.body;
            const isValid = await this.authenticationService.verifyOtp(email, otp);
            if (!isValid.success) {
                SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS,isValid)
                return 
            }
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS,isValid)
        } catch (error) {
            next(error);
        }
    }

    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                // return res.status(400).json({ message: "All fields are required" });
              }

            //   const result = await authenticationService.registerUser(username, email, password);

            //   res.cookie("authToken", result.user.token, {
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV === "production",
            //     sameSite: "strict",
            //   });


        } catch (error) {
            next(error);
        }
    }
}

