import UserModel,{ IUserModel } from "../../models/user.models"; 
import { BaseRepository } from "../base.repository";
import { injectable } from "tsyringe";

@injectable()
export class AuthenticationRepository extends BaseRepository<IUserModel> {
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