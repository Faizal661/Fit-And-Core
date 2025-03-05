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
            SendResponse(res, HTTPStatusCodes.OK, ResponseMessage.SUCCESS,result)
        } catch (error: any) {
            next(error);
        }
    }
}


 