import argon2 from "argon2";
import type {
  LoginInput,
  RegisterInput,
} from "../validation-schema/auth.validation.js";
import db from "../../config/db.js";
import { users } from "../../db/schema/user.schema.js";
import { ApiError, Success } from "../dto/api-response.js";
import { eq, or } from "drizzle-orm";
import * as jwt from "jsonwebtoken";
import "dotenv";
import { auth } from "../../db/schema/auth.schema.js";

const jwtSecret = process.env.JWT_SECRET_KEY;

export const signInUser = async (data: LoginInput) => {
  const { phone, email, password } = data;

  const existingUser = await db
    .select()
    .from(users)
    .where(or(eq(users.phone, phone), eq(users.email, email)));

  if (existingUser.length == 0) {
    throw new ApiError("Email or password is invalid", 404, null);
  }

  try {
    const userData = await db
      .select({
        password: users.password,
        user_id: users.id,
        name: users.name,
        phone: users.phone,
        email: users.email,
      })
      .from(users)
      .where(or(eq(users.email, email), eq(users.phone, phone)));

    const jwtPayload = {
      user_id: userData[0]?.user_id,
      email: userData[0]?.email,
      phone: userData[0]?.phone,
      name: userData[0]?.name,
    };

    const verified = await argon2.verify(userData[0].password!, password);

    if (verified) {
      const refreshToken = jwt.sign(jwtPayload, jwtSecret!, {
        algorithm: "HS256",
        expiresIn: "7d",
      });
      const accessToken = jwt.sign(jwtPayload, jwtSecret!, {
        algorithm: "HS256",
        expiresIn: "8h",
      });
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      const response = await db
        .insert(auth)
        .values({
          user_id: userData[0]?.user_id!,
          expires_at: expiresAt,
          access_token: accessToken,
        })
        .returning();

      if (response.length > 0) {
        const success = new Success("Logged in successfully", 201);
        return {
          success: success,
          access_token: accessToken,
        };
      }
    } else {
      throw new ApiError("Invalid email or password", 409, null);
    }
  } catch (error) {}
};

export const registerUser = async (data: RegisterInput) => {
  const { phone, email, password, name } = data;
  const hashedPassword = await argon2.hash(password);
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.phone, phone)));

    if (existingUser.length > 0) {
      throw new ApiError("User already exists", 409, null);
    }

    // todo: create user acc after phone number verification via otp

    const result = await db
      .insert(users)
      .values({
        name: name,
        email: email,
        phone: phone,
        password: hashedPassword,
      })
      .returning();

    if (result.length > 0) {
      return new Success("User registered successfully", 201);
    }
  } catch (error) {
    throw new ApiError("Failed to register user", 404, error);
  }
};
