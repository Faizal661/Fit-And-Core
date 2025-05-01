import { z } from "zod";

export type availabilityFormData = z.infer<typeof availabilitySchema>;

export const availabilitySchema = z
  .object({
    startTime: z.string(),
    endTime: z.string(),
    slotDuration: z.number().min(15).max(60),
  })
  .refine(
    (data) => {
      const startMinutes = timeToMinutes(data.startTime);
      const endMinutes = timeToMinutes(data.endTime);
      return endMinutes > startMinutes;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

const timeToMinutes = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};
