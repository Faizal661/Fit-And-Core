import api from "../../config/axios.config";
// import { FoodLogFormData } from "../../schemas/foodLogSchema";

export const createNewFoodLog = async (
    data: { foodDescription: string; mealType: string; selectedDate: Date }
) => {
  const response = await api.post("/food-logs", data);
  return response.data.newfoodLog;
};

export const getFoodLogsByDate = async (
  selectedDate: Date,
  traineeId: string
) => {
  const response = await api.get(
    `/food-logs/${traineeId}?date=${selectedDate.toISOString()}`
  );
  return response.data.foodLogs;
};

export const getmonthlyFoodLogs = async () => {
  async () => {
    await new Promise((res) => setTimeout(res, 300));
    return ["2025-05-03", "2025-05-07", "2025-05-15", "2025-05-17"];
  };
};
