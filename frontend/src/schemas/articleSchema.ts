import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  content: z.string().min(150, "Content must be at least 150 characters."),
  thumbnail: z.union([
    z
      .instanceof(File)
      .refine((file) => file.size <= 5242880, {
        message: "Image must be less than 5MB",
      })
      .refine(
        (file) =>
          ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
            file.type
          ),
        "Thumbnail must be an image (JPEG, JPG, PNG, or WebP)"
      ),
    z.string().url("Thumbnail must be a valid URL").optional(),
  ]),
  tags: z
    .array(z.string())
    .min(1, "At least one tag is required")
    .max(5, "We can only add five tags."),
});

export type ArticleFormData = z.infer<typeof articleSchema>;
