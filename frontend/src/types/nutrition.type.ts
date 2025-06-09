export type MealType = "breakfast" | "lunch" | "dinner" | "snacks";

export interface parsedFoodsData {
  name: string;
  quantity: string;
}

export interface NutritionData {
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  fiber?: number;
}

export interface IFoodLog {
  _id:string,
  userId: string;
  mealType: MealType;
  foodDescription: string;
  parsedFoods: parsedFoodsData[];
  nutrition: NutritionData;
  consumedAt: Date;
}
