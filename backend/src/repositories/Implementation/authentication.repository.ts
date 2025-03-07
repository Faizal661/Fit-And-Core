import { injectable } from "tsyringe";
import UserModel,{ IUserModel } from "../../models/user.models"; 
import { BaseRepository } from "./base.repository";
import { IAuthenticationRepository } from "../Interface/IAuthenticationRepository";

@injectable()
export class AuthenticationRepository extends BaseRepository<IUserModel> implements IAuthenticationRepository {

    constructor() {
        super(UserModel); 
    }

    async isUsernameTaken(username: string): Promise<boolean> {
        const user = await this.findOne({ username });
        return !!user; 
    }

    async isEmailTaken(email: string): Promise<boolean> {
        const user = await this.findOne({ email });
        return !!user; 
    }
}