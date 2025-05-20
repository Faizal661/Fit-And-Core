import mongoose, { Schema, Document, Types } from "mongoose";
import { IFoodLog } from "../types/nutrition.types";

export interface IFoodLogModel extends Document, IFoodLog {
  _id: Types.ObjectId;
}

const FoodLogSchema = new Schema<IFoodLogModel>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snacks"],
      required: true,
      index: true,
    },
    foodDescription: { type: String, required: true },
    parsedFoods: [
      {
        name: { type: String },
        quantity: { type: String },
      },
    ],
    nutrition: {
      calories: { type: Number },
      protein: { type: Number },
      carbohydrates: { type: Number },
      fat: { type: Number },
      fiber: { type: Number },
    },
    consumedAt:{ type: Date, required: true },
  },
  { timestamps: true }
);

export const FoodLogModel = mongoose.model<IFoodLogModel>(
  "FoodLog",
  FoodLogSchema
);

export default FoodLogModel;
