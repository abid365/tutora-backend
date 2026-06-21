import express from "express";
import { Request, Response } from "express";
import {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} from "../services/application.service.js";
import { ApiError } from "../dto/api-response.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { applyJobSchema } from "../validation-schema/application.validation.js";

const router = express();

router.post("/", authenticate, async (req: Request, res: Response) => {
  try {
    const parsed = applyJobSchema.parse(req.body);
    const response = await applyToJob(parsed, req.user!.user_id);
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

router.get("/my", authenticate, async (req: Request, res: Response) => {
  try {
    const applications = await getMyApplications(req.user!.user_id);
    res.json(applications);
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
  "/job/:jobId",
  authenticate,
  async (req: Request<{ jobId: string }>, res: Response) => {
    try {
      const applications = await getJobApplications(
        req.params.jobId,
        req.user!.user_id,
      );
      res.json(applications);
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
      const response = await updateApplicationStatus(
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
