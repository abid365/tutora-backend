import db from "../../config/db.js";
import { jobs } from "../../db/schema/job.schema.js";
import { ApiError, Success } from "../dto/api-response.js";
import type { CreateJobInput } from "../validation-schema/job.validation.js";
import { eq, desc } from "drizzle-orm";

export const createJob = async (data: CreateJobInput, guardianId: string) => {
  try {
    const result = await db
      .insert(jobs)
      .values({
        ...data,
        guardian_id: guardianId,
      })
      .returning();

    if (result.length > 0) {
      return {
        success: new Success("Job posted successfully", 201),
        job: result[0],
      };
    }

    throw new ApiError("Failed to create job", 500, null);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Failed to create job", 500, error);
  }
};

export const getAllJobs = async () => {
  try {
    const result = await db
      .select()
      .from(jobs)
      .where(eq(jobs.status, "open"))
      .orderBy(desc(jobs.created_at));

    return result;
  } catch (error) {
    throw new ApiError("Failed to fetch jobs", 500, error);
  }
};

export const getGuardianJobs = async (guardianId: string) => {
  try {
    const result = await db
      .select()
      .from(jobs)
      .where(eq(jobs.guardian_id, guardianId));

    return result;
  } catch (error) {
    throw new ApiError("Failed to fetch jobs", 500, error);
  }
};

export const getJobById = async (jobId: string, guardianId: string) => {
  try {
    const result = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, jobId));

    if (result.length === 0) {
      throw new ApiError("Job not found", 404, null);
    }

    if (result[0].guardian_id !== guardianId) {
      throw new ApiError("Unauthorized to view this job", 403, null);
    }

    return result[0];
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Failed to fetch job", 500, error);
  }
};

export const updateJobStatus = async (
  jobId: string,
  status: string,
  guardianId: string,
) => {
  try {
    const existing = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, jobId));

    if (existing.length === 0) {
      throw new ApiError("Job not found", 404, null);
    }

    if (existing[0].guardian_id !== guardianId) {
      throw new ApiError("Unauthorized to update this job", 403, null);
    }

    const validStatuses = ["open", "closed", "filled", "cancelled"];
    if (!validStatuses.includes(status)) {
      throw new ApiError("Invalid status", 400, null);
    }

    const result = await db
      .update(jobs)
      .set({ status, updated_at: new Date() })
      .where(eq(jobs.id, jobId))
      .returning();

    return {
      success: new Success("Job status updated", 200),
      job: result[0],
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Failed to update job", 500, error);
  }
};
