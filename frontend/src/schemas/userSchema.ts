import { z } from "zod";

export type UserProfileFormData = z.infer<typeof userProfileSchema>;

export const userProfileSchema = z.object({
  gender: z.string().min(1, "Gender is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(
      /^[0-9+\-\s]+$/,
      "Phone number can only contain digits, +, -, and spaces"
    ),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  pinCode: z
    .string()
    .min(4, "Pin code must be at least 4 digits")
    .regex(/^[0-9]+$/, "Pin code can only contain digits"),
});

