import { z } from "zod";

export const applyJobSchema = z.object({
  job_id: z.string().uuid(),
  message: z.string().max(1000).trim().optional(),
});

export type ApplyJobInput = z.infer<typeof applyJobSchema>;
