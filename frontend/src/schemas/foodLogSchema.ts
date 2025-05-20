import { z } from "zod";

export const foodLogSchema = z.object({
  foodDescription: z
    .string()
    .min(3, "Food description must be at least 3 characters")
    .max(500, "Food description cannot exceed 500 characters")
    .transform((val) => val.trim())
    .refine(
        (val) => val.length >= 3,
        "Food description must be at least 3 characters"
      ),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snacks"], {
    required_error: "Please select a meal type",
  }),
});

export type FoodLogFormData = z.infer<typeof foodLogSchema>;
