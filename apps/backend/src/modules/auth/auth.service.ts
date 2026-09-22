import bcrypt from "bcrypt";
import { RegisterDto } from "./auth.dto";
import { db } from "../../../prisma/db";

export const registerUser = async (input: RegisterDto) => {
  const body = input.body

  const existingUser = await db.orm.public.User.where({
    email: body.email,
  }).first();

  if (existingUser) {
    const error = new Error("Email is already registered") as Error & { statusCode?: number };
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);

  const user = await db.orm.public.User.create({
      email: body.email,
      password: hashedPassword,
      role: body.role,
  });

  return user;
};