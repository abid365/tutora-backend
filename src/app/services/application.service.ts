import db from "../../config/db.js";
import { applications } from "../../db/schema/application.schema.js";
import { jobs } from "../../db/schema/job.schema.js";
import { ApiError } from "../dto/api-response.js";
import type { ApplyJobInput } from "../validation-schema/application.validation.js";
import { eq, and } from "drizzle-orm";

export const applyToJob = async (data: ApplyJobInput, studentId: string) => {
  const { job_id, message } = data;

  try {
    const job = await db.select().from(jobs).where(eq(jobs.id, job_id));

    if (job.length === 0) {
      throw new ApiError("Job not found", 404, null);
    }

    if (job[0].status !== "open") {
      throw new ApiError("Job is no longer accepting applications", 400, null);
    }

    if (job[0].guardian_id === studentId) {
      throw new ApiError("Cannot apply to your own job", 400, null);
    }

    const existing = await db
      .select()
      .from(applications)
      .where(
        and(
          eq(applications.job_id, job_id),
          eq(applications.student_id, studentId),
        ),
      );

    if (existing.length > 0) {
      throw new ApiError("Already applied to this job", 409, null);
    }

    const result = await db
      .insert(applications)
      .values({
        job_id,
        student_id: studentId,
        message,
      })
      .returning();

    return {
      message: "Application submitted successfully",
      application: result[0],
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Failed to submit application", 500, error);
  }
};

export const getMyApplications = async (studentId: string) => {
  try {
    const result = await db
      .select()
      .from(applications)
      .where(eq(applications.student_id, studentId))
      .orderBy(eq(applications.created_at, applications.created_at));

    return result;
  } catch (error) {
    throw new ApiError("Failed to fetch applications", 500, error);
  }
};

export const getJobApplications = async (jobId: string, guardianId: string) => {
  try {
    const job = await db.select().from(jobs).where(eq(jobs.id, jobId));

    if (job.length === 0) {
      throw new ApiError("Job not found", 404, null);
    }

    if (job[0].guardian_id !== guardianId) {
      throw new ApiError("Unauthorized to view these applications", 403, null);
    }

    const result = await db
      .select()
      .from(applications)
      .where(eq(applications.job_id, jobId));

    return result;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Failed to fetch applications", 500, error);
  }
};

export const updateApplicationStatus = async (
  applicationId: string,
  status: string,
  guardianId: string,
) => {
  try {
    const application = await db
      .select()
      .from(applications)
      .where(eq(applications.id, applicationId));

    if (application.length === 0) {
      throw new ApiError("Application not found", 404, null);
    }

    const job = await db
      .select()
      .from(jobs)
      .where(eq(jobs.id, application[0].job_id));

    if (job[0].guardian_id !== guardianId) {
      throw new ApiError(
        "Unauthorized to update this application",
        403,
        null,
      );
    }

    const validStatuses = ["accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      throw new ApiError(
        "Status must be either 'accepted' or 'rejected'",
        400,
        null,
      );
    }

    const result = await db
      .update(applications)
      .set({ status, updated_at: new Date() })
      .where(eq(applications.id, applicationId))
      .returning();

    if (status === "accepted") {
      await db
        .update(jobs)
        .set({ status: "filled", updated_at: new Date() })
        .where(eq(jobs.id, application[0].job_id));

      await db
        .update(applications)
        .set({ status: "rejected", updated_at: new Date() })
        .where(
          and(
            eq(applications.job_id, application[0].job_id),
            eq(applications.status, "pending"),
          ),
        );
    }

    return {
      message: `Application ${status}`,
      application: result[0],
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Failed to update application", 500, error);
  }
};
