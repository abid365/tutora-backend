import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().min(3).max(100).trim(),
  description: z.string().min(10).max(2000).trim(),
  subject: z.string().min(2).max(50).trim(),
  level: z.enum([
    "preschool",
    "elementary",
    "middle_school",
    "high_school",
    "college",
    "adult",
  ]),
  location_type: z.enum(["online", "in_person", "both"]).default("online"),
  location: z.string().max(200).trim().optional(),
  rate_type: z.enum(["hourly", "fixed"]).default("hourly"),
  rate_amount: z.number().positive(),
  currency: z.string().length(3).default("USD"),
  schedule: z.string().max(1000).optional(),
  sessions_per_week: z.number().int().positive().optional(),
  duration_minutes: z.number().int().positive().optional(),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
