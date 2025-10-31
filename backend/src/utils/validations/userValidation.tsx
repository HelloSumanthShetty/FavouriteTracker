import { z } from "zod";

export const userSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long"),

  email: z.email("Invalid email format"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password too long"),
});

export const signupSchema = userSchema;

export const loginSchema = userSchema.pick({
  email: true,
  password: true,
});

export const updateUserSchema = userSchema.partial();
