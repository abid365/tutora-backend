import { z } from "zod";

const registerSchema = z.object({
  phone: z.number(),
  email: z.email().toLowerCase().trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must be at most 16 characters"),
  name: z.string().min(3, "Name is required").max(30).trim(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  phone: z.number(),
  email: z.email().toLowerCase().trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must be at most 16 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
