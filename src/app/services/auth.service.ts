import argon2 from "argon2";
import type {
  LoginInput,
  RegisterInput,
} from "../validation-schema/auth.validation.js";
import db from "../../config/db.js";
import { users } from "../../db/schema/user.schema.js";
import { ApiError, Success } from "../dto/api-response.js";
import { eq, or } from "drizzle-orm";

export const signInUser = async (data: LoginInput) => {
  const { phone, email, password } = data;
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
