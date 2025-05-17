import { z } from "zod";

export const progressionSchema = z.object({
  height: z
    .number()
    .min(100, "Height must be at least 100 cm")
    .max(300, "Height cannot exceed 300 cm"),
  weight: z
    .number()
    .min(30, "Weight must be at least 30 kg")
    .max(300, "Weight cannot exceed 300 kg"),
});

export type ProgressionFormData = z.infer<typeof progressionSchema>;
