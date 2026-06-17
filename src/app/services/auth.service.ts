import argon2 from "argon2";
import type { RegisterInput } from "../validation-schema/auth.validation.js";
import db from "../../config/db.js";
import { users } from "../../db/schema/user.schema.js";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const registerUser = async (data: RegisterInput) => {
  const { phone, email, password, name } = data;
  const hashedPassword = await argon2.hash(password);
  try {
    const response = await db.insert(users).values({
      name: name,
      email: email,
      phone: phone,
      password: hashedPassword,
    });
  } catch (error) {
    throw new Error();
  }
};
