import argon2 from "argon2";
import type { RegisterInput } from "../validation-schema/auth.validation.js";
import db from "../../config/db.js";
import { users } from "../../db/schema/user.schema.js";

class ApiError extends Error {
  status: number;
  error: any;
  constructor(message: string, status: number, error: any) {
    super(message);
    this.status = status;
    this.error = error;
  }
}

class Success {
  status: number;
  message: string;
  constructor(message: string, status: number) {
    this.message = message;
    this.status = status;
  }
}

export const registerUser = async (data: RegisterInput) => {
  const { phone, email, password, name } = data;
  const hashedPassword = await argon2.hash(password);
  try {
    // todo: create user acc after phone number verification via otp
    const response = await db
      .insert(users)
      .values({
        name: name,
        email: email,
        phone: phone,
        password: hashedPassword,
      })
      .returning();

    if (response.length > 0) {
      return new Success("User registered successfully", 201);
    }
  } catch (error) {
    throw new ApiError("Failed to register user", 499, error);
  }
};
