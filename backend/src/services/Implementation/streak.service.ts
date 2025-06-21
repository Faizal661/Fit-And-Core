import { inject, injectable } from "tsyringe";
import { IUserStreakModel } from "../../models/streak.models";
import { HeatmapData, OverallStreakData } from "../../types/streak.types";
import { IStreakRepository } from "../../repositories/Interface/IStreakRepository";
import { IStreakService } from "../Interface/IStreakService";

@injectable()
export class StreakService implements IStreakService {
  constructor(
    @inject("StreakRepository")
    private streakRepository: IStreakRepository // @inject('NotificationService')
  ) // private notificationService: NotificationService,
  {}

  private getUtcStartOfDay(date: Date): Date {
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
  }

  async getOverallStreakData(userId: string): Promise<OverallStreakData> {
    const streak = await this.streakRepository.findOne({ userId });

    if (!streak) {
      return {
        currentStreak: 0,
        maxStreak: 0,
        totalActivities: 0,
        lastActivityDate: null,
        userPoints: 0,
      };
    }

    // const totalPointsEarned = streak.dailyActivityCounts.reduce((sum, entry) => sum + entry.count, 0);

    return {
      currentStreak: streak.currentStreak,
      maxStreak: streak.longestStreak,
      totalActivities: streak.dailyActivityCounts.length,
      lastActivityDate: streak.lastActivityDate
        ? streak.lastActivityDate.toISOString().split("T")[0]
        : null,
      userPoints: streak.userPoints,
    };
  }

  async getHeatmapData(
    userId: string,
    year: number
  ): Promise<HeatmapData[]> {
    const streak = await this.streakRepository.findOne({ userId });

    if (!streak || !streak.dailyActivityCounts) {
      return [];
    }

    const HeatmapData: HeatmapData[] = [];

    streak.dailyActivityCounts.forEach((activity) => {
      if (activity.date.getUTCFullYear() === year) {
        HeatmapData.push({
          value: activity.points, 
          day: activity.date.toISOString().split("T")[0], 
        });
      }
    });

    return HeatmapData;
  }



  async recordActivityAndHandleStreak(
    userId: string,
    activityDate: Date = new Date(),
    pointsToAward: number = 5
  ): Promise<void> {
    const streak = await this.streakRepository.findOrCreate(userId.toString());

    const currentActivityDayUtc = this.getUtcStartOfDay(activityDate);

    let updatedStreakCount = streak.currentStreak;
    // let notificationMessage = ''; // NOT USED
    // let notificationType = 'general'; // NOT USED
    // let shouldSendNotification = false; // NOT USED

    const lastActivityDayUtc = streak.lastActivityDate
      ? this.getUtcStartOfDay(streak.lastActivityDate)
      : null;

    let shouldUpdateStreakCounter = false;
    if (!lastActivityDayUtc) {
      updatedStreakCount = 1;
      shouldUpdateStreakCounter = true;
    } else if (
      currentActivityDayUtc.getTime() === lastActivityDayUtc.getTime()
    ) {
      // Activity on the same day: streak counter doesn't change, just update points/activity count for the day
      console.log(
        `Activity already recorded for user ${userId} on ${
          currentActivityDayUtc.toISOString().split("T")[0]
        }. Just updating activity count.`
      );
      // No change to updatedStreakCount
    } else {
      // Check if yesterday was active (relative to current activityDate)
      const yesterday = new Date(activityDate);
      yesterday.setDate(activityDate.getDate() - 1);
      const yesterdayUtc = this.getUtcStartOfDay(yesterday);

      if (yesterdayUtc.getTime() === lastActivityDayUtc.getTime()) {
        // Consecutive day: increment streak
        updatedStreakCount = streak.currentStreak + 1;
        shouldUpdateStreakCounter = true;
      } else {
        // Gap day: reset streak
        updatedStreakCount = 1; // Start new streak
        shouldUpdateStreakCounter = true;
      }
    }

    const updatedLongestStreak = Math.max(
      streak.longestStreak,
      updatedStreakCount
    );

    await this.streakRepository.updateStreakAndActivityCountAndPoints(
      userId.toString(),
      {
        currentStreak: updatedStreakCount,
        lastActivityDate: activityDate, 
        longestStreak: updatedLongestStreak,
      },
      currentActivityDayUtc, 
      pointsToAward 
    );

    console.log(
      `User ${userId}: Streak updated to ${updatedStreakCount} days. Longest: ${updatedLongestStreak}, Points awarded: ${pointsToAward}`
    );
  }

}
