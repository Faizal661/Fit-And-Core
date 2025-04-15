import { z } from "zod";

export type TrainerApplyFormData = z.infer<typeof trainerApplySchema>;

export const trainerApplySchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(
      /^[0-9+\-\s]+$/,
      "Phone number can only contain digits, +, -, and spaces"
    ),
  specialization: z
    .string()
    .min(3, "Specialization is required")
    .max(100, "Specialization must be less than 100 characters"),
  yearsOfExperience: z.string().min(1, "Years of experience is required"),
  about: z
    .string()
    .min(50, "Please provide at least 50 characters about your career")
    .max(500, "About section must be less than 500 characters"),
});


export const rejectReasonSchema = z
  .string()
  .min(10, "Reason must be at least 10 characters")
  .max(500, "Reason cannot exceed 500 characters");
