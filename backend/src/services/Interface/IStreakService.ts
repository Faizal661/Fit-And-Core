import { IUserStreakModel } from "../../models/streak.models";
import { HeatmapData, OverallStreakData } from "../../types/streak.types";

export interface IStreakService {
  recordActivityAndHandleStreak(
    userId: string,
    activityDate: Date ,
    pointsToAward: number
  ): Promise<void>;
  getOverallStreakData(userId: string): Promise<OverallStreakData>
  getHeatmapData(userId: string, year: number): Promise<HeatmapData[]>
}
