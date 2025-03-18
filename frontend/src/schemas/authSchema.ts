import { z } from "zod";


export const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});
export type EmailFormData = z.infer<typeof emailSchema>;


export const userNameEmailSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
});
export type UsernameEmailFormData = z.infer<typeof userNameEmailSchema>;


export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only digits"),
});
export type OtpFormData = z.infer<typeof otpSchema>;


export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password is too long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type PasswordFormData = z.infer<typeof passwordSchema>;



export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
});

export type LoginFormData = z.infer<typeof loginSchema>;



export const trainerApplySchema = z.object({
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\-\s]+$/, "Phone number can only contain digits, +, -, and spaces"),
  specialization: z.string()
    .min(3, "Specialization is required")
    .max(100, "Specialization must be less than 100 characters"),
  yearsOfExperience: z.string()
    .min(1, "Years of experience is required"),
  about: z.string()
    .min(50, "Please provide at least 50 characters about your career")
    .max(500, "About section must be less than 500 characters"),
});

export type TrainerApplyFormData = z.infer<typeof trainerApplySchema>;