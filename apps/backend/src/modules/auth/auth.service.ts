import bcrypt from "bcrypt";
import { RegisterDto } from "./auth.dto";
import { db } from "../../../prisma/db";
import { AppError } from "../../lib/errors";

export const registerUser = async (input: RegisterDto) => {
  const body = input.body

  const existingUser = await db.orm.public.User.where({
    email: body.email,
  }).first();

  if (existingUser) {
    throw new AppError("Email is already registered", 400);
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);

  const user = await db.orm.public.User.create({
      email: body.email,
      password: hashedPassword,
      role: body.role,
  });

  return user;
};