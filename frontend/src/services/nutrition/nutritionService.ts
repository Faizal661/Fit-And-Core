import api from "../../config/axios.config";
// import { FoodLogFormData } from "../../schemas/foodLogSchema";

export const createNewFoodLog = async (data: {
  foodDescription: string;
  mealType: string;
  selectedDate: Date;
}) => {
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

export const getFoodLogDatesByMonth = async (month:Date,traineeId:string) => {
    const response = await api.get(`/food-logs/${traineeId}/dates?month=${month}`);
    return response.data.loggedDates;
};
