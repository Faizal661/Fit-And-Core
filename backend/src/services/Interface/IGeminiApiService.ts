import { NutritionData, parsedFoodsData } from "../../types/nutrition.types";

export interface IGeminiService {
  parseFoodDescription(foodDescription: string): Promise<parsedFoodsData[]>;
  getNutrition(
    foodDescription: string,
  ): Promise<NutritionData>;
}
