import api from "../../config/axios.config";

export const getStreakData = async () => {
  const response = await api.get("/streaks/overall");
  return response.data.overallStreakData;
};


export const getHeatmapData = async (year:number) => {
  const response = await api.get(`/streaks/heatmap?year=${year}`);
  return response.data.heatmapData;
};
