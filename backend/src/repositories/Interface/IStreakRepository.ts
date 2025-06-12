import { IUserStreakModel } from "../../models/streak.models";
import { IUserStreak } from "../../types/streak.types";
import { BaseRepository } from "../Implementation/base.repository";

export interface IStreakRepository
  extends Omit<BaseRepository<IUserStreakModel>, "model"> {
  findOrCreate(userId: string): Promise<IUserStreakModel>;
  updateStreakAndActivityCountAndPoints(
    userId: string,
    update: Partial<Omit<IUserStreak, "dailyActivityCounts" | "userPoints">>, 
    dailyActivityDate: Date, 
    pointsToAward: number 
  ): Promise<IUserStreakModel | null>;
}