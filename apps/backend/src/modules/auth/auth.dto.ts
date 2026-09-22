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