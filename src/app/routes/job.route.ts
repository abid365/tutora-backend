import express from "express";
import { Request, Response } from "express";
import {
  createJob,
  getAllJobs,
  getGuardianJobs,
  getJobById,
  updateJobStatus,
} from "../services/job.service.js";
import { ApiError } from "../dto/api-response.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { createJobSchema } from "../validation-schema/job.validation.js";

const router = express();

router.post("/", authenticate, async (req: Request, res: Response) => {
  try {
    const parsed = createJobSchema.parse(req.body);
    const response = await createJob(parsed, req.user!.user_id);
    res.status(201).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({
        error: error.message,
        details: error.error,
      });
    } else {
      res.status(400).json({ error: "Validation failed", details: error });
    }
  }
});

router.get("/all", async (req: Request, res: Response) => {
  try {
    const jobs = await getAllJobs();
    res.json(jobs);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({
        error: error.message,
        details: error.error,
      });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

router.get("/", authenticate, async (req: Request, res: Response) => {
  try {
    const jobs = await getGuardianJobs(req.user!.user_id);
    res.json(jobs);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({
        error: error.message,
        details: error.error,
      });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

router.get(
  "/:id",
  authenticate,
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const job = await getJobById(req.params.id, req.user!.user_id);
      res.json(job);
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.status).json({
          error: error.message,
          details: error.error,
        });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
);

router.patch(
  "/:id/status",
  authenticate,
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const { status } = req.body;
      const response = await updateJobStatus(
        req.params.id,
        status,
        req.user!.user_id,
      );
      res.json(response);
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.status).json({
          error: error.message,
          details: error.error,
        });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  },
);

export default router;
