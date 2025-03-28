import { IUserModel } from "../../models/user.models";

export interface IAdminService {
  userCount(): Promise<number>;
  trainerCount(): Promise<number>;
  getMonthlySubscriptionData(): Promise<
    { name: string; users: number; trainers: number }[]
  >;
}
