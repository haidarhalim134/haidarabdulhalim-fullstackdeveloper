import * as z from "zod";

export const RoleEnum = z.enum(['JOB_SEEKER', 'COMPANY']);

export const registerSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(8),
    role: RoleEnum,
  })
});

export type RegisterDto = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(8)
  })
});

export type LoginDto = z.infer<typeof loginSchema>;

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    role: string;
  };
  token: string;
}
