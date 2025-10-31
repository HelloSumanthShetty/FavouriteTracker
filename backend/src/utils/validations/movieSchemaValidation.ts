import { z } from "zod";

export const sampleSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title too long"),
  type: z.enum(["MOVIE", "TV_SHOW"], {
      message: "Must be either MOVIE or TV_SHOW"
  }),
  director: z
    .string()
    .min(1, "Director name required")
    .max(50, "Director name too long"),
  budget: z
    .string()
    .regex(/^\$?\d+(M|k|B)?(\/ep)?$/, {
      message: "Invalid budget format (e.g. $<amount>M or $<amount>M/ep)",
    }),
  location: z
    .string()
    .min(2, "Location required")
    .max(100, "Location too long"),
  duration: z
    .string()
    .regex(/^\d+\s?min(\/ep)?$/, {
      message: "Duration must look like '<duration> min' or '<duration> min/ep'",
    }),
  yearOrTime: z
    .string()
    .regex(/^\d{4}(-\d{4})?$/, {
      message: "Invalid year or range (e.g. YYYY or YYYY-YYYY)",
    }),
});
