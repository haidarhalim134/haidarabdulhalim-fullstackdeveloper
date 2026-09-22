import bcrypt from "bcrypt";
import { AuthResponse, LoginDto, RegisterDto } from "./auth.dto";
import { db } from "../../../prisma/db";
import { AppError, UnauthorizedError } from "../../lib/errors";
import jwt from "jsonwebtoken";

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

const generateToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

export const loginUser = async (loginData: LoginDto): Promise<AuthResponse> => {
  const { email, password } = loginData.body;

  const user = await db.orm.public.User.where({
    email
  }).first();

  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const token = await generateToken(user.id);
  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
};