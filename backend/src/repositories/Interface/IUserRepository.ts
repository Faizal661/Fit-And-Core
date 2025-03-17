import { BaseRepository } from "../Implementation/base.repository";
import { IUserModel } from "../../models/user.models";

export interface IUserRepository extends Omit<BaseRepository<IUserModel>, 'model'> {
    
}