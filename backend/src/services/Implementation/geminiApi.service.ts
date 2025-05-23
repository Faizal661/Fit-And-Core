import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../../config/env.config";
import { NutritionData, parsedFoodsData } from "../../types/nutrition.types";
import { CustomError } from "../../errors/CustomError";
import { HttpResCode } from "../../constants/http-response.constants";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export class GeminiService {
  private model: any;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  private parseGeminiJSON(text: string) {
    const jsonRegex = /```(?:json)?\s*([\s\S]*?)```/;
    const match = text.match(jsonRegex);
    if (match && match[1]) {
      return match[1].trim();
    }
    return null;
  }

  async parseFoodDescription(
    foodDescription: string
  ): Promise<parsedFoodsData[]> {
    try {
      const prompt = `
        Extract the food items and their quantities from the following text.
        Return the data as a JSON array.  Each object in the array
        should have a "name" property and a "quantity" property.
        If a quantity is not explicitly mentioned, use "some".

        Example:
        Text: "I had 2 slices of pizza and a salad."
        Output:
        [
          { "name": "pizza", "quantity": "2 slices" },
          { "name": "salad", "quantity": "some" }
        ]

        Text: "${foodDescription}"
        Output:
      `;

      const result = await this.model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
      const response = result.response;

      if (
        !response ||
        !response.candidates ||
        response.candidates.length === 0 ||
        !response.candidates[0].content
      ) {
        console.error("Gemini API returned an unexpected response:", response);
        throw new CustomError(
          "Failed to extract food list from your input, Please try again ",
          HttpResCode.BAD_REQUEST
        );
      }

      const responseText = response.candidates[0].content.parts[0].text;
      try {
        const cleanedText = this.parseGeminiJSON(responseText);
        if (cleanedText === null) {
          throw new CustomError(
            "Failed to extract food list from your input, Please try again ",
            HttpResCode.BAD_REQUEST
          );
        }
        const parsedData = JSON.parse(cleanedText.trim());
        if (Object.keys(parsedData).length === 0) {
          throw new CustomError(
            "Failed to extract food list from your input, Please try again ",
            HttpResCode.INTERNAL_SERVER_ERROR
          );
        }
        return parsedData;
      } catch (parseError) {
        console.error("Error parsing Gemini response:", parseError);
        if (parseError instanceof CustomError) {
          throw parseError;
        }
        return [{ name: "error", quantity: "error" }];
      }
    } catch (error: any) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        throw new Error(`Gemini API error: ${error.message}`);
      }
    }
  }

  async getNutrition(parsedFoodsData: parsedFoodsData[]): Promise<NutritionData> {
    try {
      const prompt = `
        Extract the total nutritional information (calories, protein, carbohydrates, fat, and fiber) for the following list of food items and their quantities. Provide the nutrition as a JSON object. If a specific quantity is not provided for an item in the input array, assume a reasonable quantity.

        Input: 
        [
          { "name": "chicken", "quantity": "100 gm" },
          { "name": "rice", "quantity": "1 cup cooked" },
          { "name": "broccoli", "quantity": "1 cup" }
        ]
        Output:
        {
          "calories": 350,
          "protein": 35,
          "carbohydrates": 45,
          "fat": 10,
          "fiber": 8
        }

        Input: "${JSON.stringify(parsedFoodsData)}"
        Output:
        `;

      const result = await this.model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
      const response = result.response;

      if (
        !response ||
        !response.candidates ||
        response.candidates.length === 0 ||
        !response.candidates[0].content
      ) {
        console.error("Gemini API returned an unexpected response:", response);
        throw new CustomError(
          "Failed to retrieve nutritional information.Try again later !",
          HttpResCode.BAD_REQUEST
        );
        return {};
      }
      
      const responseText = response.candidates[0].content.parts[0].text;
      try {
        const cleanedText = this.parseGeminiJSON(responseText);
        if (cleanedText === null) {
          throw new CustomError(
            "Failed to retrieve nutritional information.Try again later !",
            HttpResCode.BAD_REQUEST
          );
        }

        const nutritionData = JSON.parse(cleanedText.trim());
        if (Object.keys(nutritionData).length === 0) {
          throw new CustomError(
            "Failed to retrieve nutritional information.Try again later !",
            HttpResCode.INTERNAL_SERVER_ERROR
          );
        }
        return nutritionData;
      } catch (parseError) {
        console.error("Error parsing Gemini nutrition response:", parseError);
        if (parseError instanceof CustomError) {
          throw parseError;
        }
        return {};
      }
    } catch (error: any) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        throw new Error(`Gemini API error getting nutrition: ${error.message}`);
      }
    }
  }
}
