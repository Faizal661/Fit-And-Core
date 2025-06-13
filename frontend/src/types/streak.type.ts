export interface HeatmapData {
  value: number;
  day: string; 
}

export interface StreakData {
  currentStreak: number;
  maxStreak: number;
  totalActivities: number;
  lastActivityDate: string;
}
