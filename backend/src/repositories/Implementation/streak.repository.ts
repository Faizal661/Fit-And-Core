import { UserStreakModel, IUserStreakModel } from "../../models/streak.models";
import { Types } from "mongoose";
import { IUserStreak } from "../../types/streak.types";
import { IStreakRepository } from "../Interface/IStreakRepository";
import { BaseRepository } from "./base.repository";
import { injectable } from "tsyringe";
import { CustomError } from "../../errors/CustomError";
import { HttpResCode } from "../../constants/http-response.constants";

@injectable()
export class StreakRepository
  extends BaseRepository<IUserStreakModel>
  implements IStreakRepository
{
  constructor() {
    super(UserStreakModel);
  }

  async findOrCreate(userId: string): Promise<IUserStreakModel> {
    try {
      let streak = await UserStreakModel.findOne({
        userId: new Types.ObjectId(userId),
      }).exec();

      if (!streak) {
        streak = new UserStreakModel({ userId: new Types.ObjectId(userId) });
        await streak.save();
      }

      return streak;
    } catch (error) {
      throw new CustomError(
        "failed to find streak",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateStreakAndActivityCountAndPoints(
    userId: string,
    update: Partial<Omit<IUserStreak, "dailyActivityCounts" | "userPoints">>,
    dailyActivityDate: Date,
    pointsToAward: number = 0
  ): Promise<IUserStreakModel | null> {
    const streak = await UserStreakModel.findOne({
      userId: new Types.ObjectId(userId),
    }).exec();

    if (!streak) {
      return null;
    }

    // Apply general streak field updates
    Object.assign(streak, update);

    // Find if an entry for dailyActivityDate already exists
    const dateIndex = streak.dailyActivityCounts.findIndex(
      (entry) => entry.date.getTime() === dailyActivityDate.getTime()
    );

    if (dateIndex > -1) {
      streak.dailyActivityCounts[dateIndex].points += pointsToAward;
    } else {
      streak.dailyActivityCounts.push({
        date: dailyActivityDate,
        points: pointsToAward,
      });
    }

    streak.dailyActivityCounts.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    streak.userPoints += pointsToAward;

    await streak.save();
    return streak;
  }
}
