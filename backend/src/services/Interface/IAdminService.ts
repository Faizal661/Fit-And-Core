import { IUserModel } from "../../models/user.models";

export interface IAdminService {
    userCount(): Promise<number>;
    trainerCount(): Promise<number>;
}