import express from "express";
import { Request, Response } from "express";
import argon2 from "argon2";

const router = express();

router.post("/login", async (req: Request, res: Response) => {
  const { phone, password } = await req.body();
});

router.post("/register", async (req: Request, res: Response) => {
  const { phone, password } = await req.body();
});
