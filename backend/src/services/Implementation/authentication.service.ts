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

    // async nameEmailCheck(email: string, name: string): Promise<any> {
    //     const isTaken = await this.authenticationRepository.isUsernameOrEmailTaken(email, name);
    //     if (isTaken) {
    //         throw new ConflictError("Username or Email already taken");
    //     }
    //     return { available: true };
    // }

    async nameEmailCheck(email: string, username: string): Promise<{ available: boolean }> {
        const isUsernameTaken = await this.authenticationRepository.isUsernameTaken(username);
        const isEmailTaken = await this.authenticationRepository.isEmailTaken(email);

        if (isUsernameTaken || isEmailTaken) {
            throw new ConflictError("Username or Email already taken");
        }

        return { available: true };
    }

}


