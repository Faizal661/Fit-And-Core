import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { HTTPStatusCodes,ConflictError } from "mern.common";
import { IAuthenticationService } from '../Interface/IAuthenticationService';
import { IAuthenticationRepository } from '../../repositories/Interface/IAuthenticationRepository';


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
}


