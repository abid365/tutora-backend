import express from "express";
import { Request, Response } from "express";
import argon2 from "argon2";
import { registerUser } from "../services/auth.service.js";
import { ApiError } from "../dto/api-response.js";

const router = express();

router.post("/login", async (req: Request, res: Response) => {
  const { phone, email, password } = req.body;
  try {
  } catch (error) {}
});

router.post("/register", async (req: Request, res: Response) => {
  const { phone, email, password, name } = req.body;
  try {
    const response = await registerUser({ phone, email, password, name });
    res.send(response);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.status).json({
        error: error.message,
        details: error.error,
      });
    }
  }
});

export default router;
