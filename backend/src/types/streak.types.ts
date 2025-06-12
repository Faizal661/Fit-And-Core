import { Types } from "mongoose";

export interface IDailyActivityCount {
  date: Date;
  points: number;
}

export interface IUserStreak {
  userId: Types.ObjectId;
  currentStreak: number;
  lastActivityDate: Date;
  longestStreak: number;
  dailyActivityCounts: IDailyActivityCount[];
  userPoints: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OverallStreakData {
  currentStreak: number;
  maxStreak: number; 
  totalActivities: number;
  lastActivityDate: string | null; 
  userPoints: number; 
}

export interface HeatmapData {
  value: number; 
  day: string; 
}