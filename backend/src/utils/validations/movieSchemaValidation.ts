import { z } from "zod";

export const sampleSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title too long"),
  type: z.enum(["Movie", "TV Show"], {
    errorMap: () => ({ message: "Type must be 'Movie' or 'TV Show'" }),
  }),
  director: z
    .string()
    .min(1, "Director name required")
    .max(50, "Director name too long"),
  budget: z
    .string()
    .regex(/^\$?\d+(M|k|B)?(\/ep)?$/, {
      message: "Invalid budget format (e.g. $160M or $3M/ep)",
    }),
  location: z
    .string()
    .min(2, "Location required")
    .max(100, "Location too long"),
  duration: z
    .string()
    .regex(/^\d+\s?min(\/ep)?$/, {
      message: "Duration must look like '148 min' or '49 min/ep'",
    }),
  yearOrTime: z
    .string()
    .regex(/^\d{4}(-\d{4})?$/, {
      message: "Invalid year or range (e.g. 2010 or 2008-2013)",
    }),
});
