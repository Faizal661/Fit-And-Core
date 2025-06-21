import { z } from "zod";

export const createGroupSchema = z.object({
  name: z.string()
    .min(3, "Group name must be at least 3 characters")
    .max(50, "Group name cannot exceed 50 characters"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),
});

export type CreateGroupFormData = z.infer<typeof createGroupSchema>;