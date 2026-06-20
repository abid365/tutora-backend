import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../app/dto/api-response.js";

const jwtSecret = process.env.JWT_SECRET_KEY;

export interface AuthPayload {
  user_id: string;
  email: string;
  phone: number;
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError("Authentication required", 401, null);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtSecret!) as AuthPayload;
    req.user = decoded;
    next();
  } catch {
    throw new ApiError("Invalid or expired token", 401, null);
  }
};
